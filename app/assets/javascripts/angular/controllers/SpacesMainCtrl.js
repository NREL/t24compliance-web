cbecc.controller('SpacesMainCtrl', ['$scope', '$sce', '$modal', 'Shared', 'Enums', function ($scope, $sce, $modal, Shared, Enums) {
  // Spaces UI Grid
  $scope.spacesGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableHiding: false,
      filter: angular.copy($scope.data.textFilter),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'floor_to_ceiling_height',
      secondLine: $sce.trustAsHtml('ft'),
      enableHiding: false,
      filters: angular.copy($scope.data.numberFilter),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'story',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapStories:this',
      editDropdownOptionsArray: $scope.data.storiesArr,
      filter: {
        condition: function (searchTerm, cellValue) {
          var haystack = $scope.data.storiesHash[cellValue];
          return _.contains(haystack.toLowerCase(), searchTerm.toLowerCase());
        }
      },
      headerCellTemplate: 'ui-grid/customHeaderCell',
      sortingAlgorithm: Shared.sort($scope.data.storiesHash)
    }, {
      name: 'area',
      secondLine: $sce.trustAsHtml('ft<sup>2</sup>'),
      enableHiding: false,
      filters: angular.copy($scope.data.numberFilter),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'conditioning_type',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapEnums:"spaces_conditioning_type_enums"',
      editDropdownOptionsArray: Enums.enumsArr.spaces_conditioning_type_enums,
      filter: {
        condition: function (searchTerm, cellValue) {
          var haystack = Enums.enumsArr.spaces_conditioning_type_enums[cellValue].value;
          return _.contains(haystack.toLowerCase(), searchTerm.toLowerCase());
        }
      },
      headerCellTemplate: 'ui-grid/customHeaderCell',
      sortingAlgorithm: Shared.sort(Enums.enumsArr.spaces_conditioning_type_enums)
    }, {
      name: 'envelope_status',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapEnums:"spaces_envelope_status_enums"',
      editDropdownOptionsArray: Enums.enumsArr.spaces_envelope_status_enums,
      filter: {
        condition: function (searchTerm, cellValue) {
          var haystack = Enums.enumsArr.spaces_envelope_status_enums[cellValue].value;
          return _.contains(haystack.toLowerCase(), searchTerm.toLowerCase());
        }
      },
      headerCellTemplate: 'ui-grid/customHeaderCell',
      sortingAlgorithm: Shared.sort(Enums.enumsArr.spaces_envelope_status_enums)
    }, {
      name: 'lighting_status',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapEnums:"spaces_lighting_status_enums"',
      editDropdownOptionsArray: Enums.enumsArr.spaces_lighting_status_enums,
      filter: {
        condition: function (searchTerm, cellValue) {
          var haystack = Enums.enumsArr.spaces_lighting_status_enums[cellValue].value;
          return _.contains(haystack.toLowerCase(), searchTerm.toLowerCase());
        }
      },
      headerCellTemplate: 'ui-grid/customHeaderCell',
      sortingAlgorithm: Shared.sort(Enums.enumsArr.spaces_lighting_status_enums)
    }],
    data: $scope.data.spaces,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.data.gridApiSpaces = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (row.isSelected) {
          $scope.data.selectedSpace = row.entity;
        } else {
          // No rows selected
          $scope.data.selectedSpace = null;
        }
      });
    }
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
            story: config.story,
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
          }
          //TODO
          /*for (j = 0; j < walls.windows; ++j) {

           }*/
        }
      });
    }, function () {
      // Modal canceled
    });
  };
}]);

cbecc.controller('ModalSpaceCreatorCtrl', [
  '$scope', '$sce', '$modalInstance', 'uiGridConstants', 'Enums', 'params', function ($scope, $sce, $modalInstance, uiGridConstants, Enums, params) {
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
        cellFilter: 'mapEnums:"spaces_space_function_enums"',
        editDropdownOptionsArray: Enums.enumsArr.spaces_space_function_enums
      }, {
        name: 'floor_to_ceiling_height',
        secondLine: $sce.trustAsHtml('ft'),
        headerCellTemplate: 'ui-grid/customHeaderCell'
      }, {
        name: 'story',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        cellFilter: 'mapStories:this',
        editDropdownOptionsArray: $scope.data.storiesArr
      }, {
        name: 'area',
        displayName: 'Area',
        secondLine: $sce.trustAsHtml('ft<sup>2</sup>'),
        headerCellTemplate: 'ui-grid/customHeaderCell',
        width: 98
      }, {
        name: 'conditioning_type',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        cellFilter: 'mapEnums:"spaces_conditioning_type_enums"',
        editDropdownOptionsArray: Enums.enumsArr.spaces_conditioning_type_enums
      }, {
        name: 'envelope_status',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        cellFilter: 'mapEnums:"spaces_envelope_status_enums"',
        editDropdownOptionsArray: Enums.enumsArr.spaces_envelope_status_enums
      }, {
        name: 'lighting_status',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        cellFilter: 'mapEnums:"spaces_lighting_status_enums"',
        editDropdownOptionsArray: Enums.enumsArr.spaces_lighting_status_enums
      }],
      data: [{
        quantity: 20,
        name: 'Small Office',
        space_function: 0,
        floor_to_ceiling_height: 10,
        story: $scope.data.stories[0].id,
        area: 250,
        conditioning_type: 0,
        envelope_status: 0,
        lighting_status: 0
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
