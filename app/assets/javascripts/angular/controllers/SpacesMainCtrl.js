cbecc.controller('SpacesMainCtrl', ['$scope', '$modal', 'uiGridConstants', 'Shared', 'Enums', function ($scope, $modal, uiGridConstants, Shared, Enums) {
  $scope.selected = {
    space: null
  };

  $scope.applySettingsActive = false;

  $scope.editableCondition = function ($scope) {
    while (!$scope.hasOwnProperty('applySettingsActive')) {
      $scope = $scope.$parent;
    }
    return !$scope.applySettingsActive;
  };

  // Spaces UI Grid
  $scope.spacesGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'floor_to_ceiling_height',
      secondLine: Shared.html('ft'),
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'building_story_id',
      displayName: 'Story',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapStories:this',
      editDropdownOptionsArray: $scope.data.storiesArr,
      filter: Shared.enumFilter($scope.data.storiesHash),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      sortingAlgorithm: Shared.sort($scope.data.storiesHash)
    }, {
      name: 'area',
      secondLine: Shared.html('ft<sup>2</sup>'),
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'conditioning_type',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.spaces_conditioning_type_enums,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'envelope_status',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.spaces_envelope_status_enums,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'lighting_status',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.spaces_lighting_status_enums,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'

    }],
    data: $scope.data.spaces,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (!$scope.applySettingsActive) {
          if (row.isSelected) {
            $scope.selected.space = row.entity;
          } else {
            // No rows selected
            $scope.selected.space = null;
          }
        }
      });
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if ((colDef.name == 'floor_to_ceiling_height' || colDef.name == 'area') && newValue != oldValue) {
          $scope.data.updateTotalExhaust(rowEntity);
        }
      });
    }
  };

  // Buttons
  $scope.applySettings = function () {
    $scope.applySettingsActive = true;
    $scope.data.clearAll($scope.gridApi);
    $scope.spacesGridOptions.multiSelect = true;
  };

  $scope.confirmApplySettings = function () {
    var replacement = {
      floor_to_ceiling_height: $scope.selected.space.floor_to_ceiling_height,
      building_story_id: $scope.selected.space.building_story_id,
      area: $scope.selected.space.area,
      conditioning_type: $scope.selected.space.conditioning_type,
      envelope_status: $scope.selected.space.envelope_status,
      lighting_status: $scope.selected.space.lighting_status
    };
    var rows = $scope.gridApi.selection.getSelectedRows();
    _.each(rows, function (row) {
      _.merge(row, replacement);
      $scope.data.updateTotalExhaust(row);
    });
    $scope.gridApi.core.notifyDataChange($scope.gridApi.grid, uiGridConstants.dataChange.EDIT);
    $scope.resetApplySettings();
  };

  $scope.resetApplySettings = function () {
    $scope.selected.space = null;
    $scope.applySettingsActive = false;
    $scope.data.clearAll($scope.gridApi);
    $scope.spacesGridOptions.multiSelect = false;
  };

  // Modal Settings
  $scope.openSpaceCreatorModal = function () {
    var modalInstance = $modal.open({
      backdrop: 'static',
      controller: 'ModalSpaceCreatorCtrl',
      templateUrl: 'spaces/spaceCreator.html',
      windowClass: 'wide-modal',
      resolve: {
        params: function () {
          return {
            data: $scope.data
          };
        }
      }
    });

    modalInstance.result.then(function (spaceGroups) {
      _.each(spaceGroups, function (spaceGroup) {
        var config = spaceGroup.config;
        var walls = spaceGroup.walls;
        for (var i = 0; i < config.quantity; ++i) {
          $scope.data.addSpace({
            name: config.name + ' ' + (i + 1),
            space_function: config.space_function,
            floor_to_ceiling_height: config.floor_to_ceiling_height,
            building_story_id: config.building_story_id,
            area: config.area,
            conditioning_type: config.conditioning_type,
            envelope_status: config.envelope_status,
            lighting_status: config.lighting_status
          });

          var spaceIndex = $scope.data.spaces.length - 1;
          for (var j = 0; j < walls.interior_walls; ++j) {
            $scope.data.addSurface('Wall', 'Interior', spaceIndex);
          }
          for (j = 0; j < walls.exterior_walls; ++j) {
            $scope.data.addSurface('Wall', 'Exterior', spaceIndex);
            for (var k = 0; k < walls.windows; ++k) {
              $scope.data.addSubsurface('Window', $scope.data.surfaces.length - 1);
            }
          }
        }
      });
    }, function () {
      // Modal canceled
    });
  };
}]);

cbecc.controller('ModalSpaceCreatorCtrl', [
  '$scope', '$modalInstance', 'uiGridConstants', 'Shared', 'Enums', 'params', function ($scope, $modalInstance, uiGridConstants, Shared, Enums, params) {
    $scope.spaceGroups = [];

    $scope.data = params.data;

    $scope.gridOptions = {
      columnDefs: [{
        name: 'quantity',
        displayName: '# of Spaces of This Type'
      }, {
        name: 'name',
        displayName: 'Name + 1,2,3...'
      }, {
        name: 'space_function',
        displayName: 'Space Type or Function',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownOptionsArray: Enums.enumsArr.spaces_space_function_enums
      }, {
        name: 'floor_to_ceiling_height',
        secondLine: Shared.html('ft'),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
      }, {
        name: 'building_story_id',
        displayName: 'Story',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        cellFilter: 'mapStories:this',
        editDropdownOptionsArray: $scope.data.storiesArr
      }, {
        name: 'area',
        displayName: 'Area',
        secondLine: Shared.html('ft<sup>2</sup>'),
        headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
        width: 98
      }, {
        name: 'conditioning_type',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownOptionsArray: Enums.enumsArr.spaces_conditioning_type_enums
      }, {
        name: 'envelope_status',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownOptionsArray: Enums.enumsArr.spaces_envelope_status_enums
      }, {
        name: 'lighting_status',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownOptionsArray: Enums.enumsArr.spaces_lighting_status_enums
      }],
      data: [{
        quantity: 20,
        name: 'Small Office',
        space_function: Enums.enums.spaces_space_function_enums[0],
        floor_to_ceiling_height: 10,
        building_story_id: $scope.data.stories[0].id,
        area: 250,
        conditioning_type: Enums.enums.spaces_conditioning_type_enums[0],
        envelope_status: Enums.enums.spaces_envelope_status_enums[0],
        lighting_status: Enums.enums.spaces_lighting_status_enums[0]
      }],
      enableCellEditOnFocus: true,
      enableColumnMenus: false,
      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableSorting: false,
      enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER
    };

    $scope.wallGridOptions = {
      columnDefs: [{
        name: 'exterior_walls',
        displayName: '# of Exterior Walls'
      }, {
        name: 'windows',
        displayName: '# of Windows on Exterior Walls'
      }, {
        name: 'interior_walls',
        displayName: '# of Interior Walls'
      }],
      data: [{
        exterior_walls: 1,
        windows: 1,
        interior_walls: 3
      }],
      enableCellEditOnFocus: true,
      enableColumnMenus: false,
      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableSorting: false,
      enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER
    };

    $scope.addSpaceGroup = function () {
      $scope.spaceGroups.push({
        gridOptions: angular.copy($scope.gridOptions),
        wallGridOptions: angular.copy($scope.wallGridOptions)
      });
    };

    $scope.addSpaceGroup();

    $scope.removeSpaceGroup = function (index) {
      $scope.spaceGroups.splice(index, 1);
    };

    $scope.ok = function () {
      var data = [];
      for (var i = 0; i < $scope.spaceGroups.length; ++i) {
        data.push({
          config: $scope.spaceGroups[i].gridOptions.data[0],
          walls: $scope.spaceGroups[i].wallGridOptions.data[0]
        });
      }
      $modalInstance.close(data);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
