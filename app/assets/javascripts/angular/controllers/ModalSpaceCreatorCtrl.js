cbecc.controller('ModalSpaceCreatorCtrl', ['$scope', '$modalInstance', 'uiGridConstants', 'Shared', 'Enums', 'params', function ($scope, $modalInstance, uiGridConstants, Shared, Enums, params) {
  $scope.spaceGroups = [];

  $scope.data = params.data;

  $scope.gridOptions = {
    columnDefs: [{
      name: 'quantity',
      displayName: '# of Spaces of This Type'
    }, {
      name: 'name',
      displayName: 'Name + 1,2,3...',
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (!row.entity.name) {
          return 'required-cell msg-enter-a-name';
        }
      }
    }, {
      name: 'space_function',
      displayName: 'Space Type or Function',
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.spaces_space_function_enums
    }, {
      name: 'floor_to_ceiling_height',
      secondLine: Shared.html('ft'),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        var storyIndex = null;
        _.find($scope.data.storiesArr, function (story, index) {
          if (story.id == row.entity.building_story_id) {
            storyIndex = index;
            return true;
          }
          return false;
        });
        if (row.entity.floor_to_ceiling_height != $scope.data.stories[storyIndex].floor_to_ceiling_height) {
          return 'modified-cell';
        }
      }
    }, {
      name: 'building_story_id',
      displayName: 'Story',
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapHash:grid.appScope.data.storiesHash',
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
      name: '',
      space_function: Enums.enums.spaces_space_function_enums[0],
      floor_to_ceiling_height: $scope.data.stories[0].floor_to_ceiling_height,
      building_story_id: $scope.data.stories[0].id,
      area: 250,
      conditioning_type: Enums.enums.spaces_conditioning_type_enums[0],
      envelope_status: Enums.enums.spaces_envelope_status_enums[0],
      lighting_status: Enums.enums.spaces_lighting_status_enums[0]
    }],
    enableCellEditOnFocus: true,
    enableColumnMenus: false,
    enableSorting: false,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if (colDef.name == 'building_story_id' && newValue != oldValue) {
          // Update floor_to_ceiling_height if it is unchanged
          var oldStoryIndex = null;
          var newStoryIndex = null;
          _.each($scope.data.storiesArr, function (story, index) {
            if (story.id == oldValue) oldStoryIndex = index;
            if (story.id == newValue) newStoryIndex = index;
          });
          if (rowEntity.floor_to_ceiling_height == $scope.data.stories[oldStoryIndex].floor_to_ceiling_height) {
            rowEntity.floor_to_ceiling_height = $scope.data.stories[newStoryIndex].floor_to_ceiling_height;
          }
          gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        }
      });
    }
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
      interior_walls: 0
    }],
    enableCellEditOnFocus: true,
    enableColumnMenus: false,
    enableSorting: false
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

  $scope.okCondition = function () {
    if (!$scope.spaceGroups.length) return false;
    return _.every($scope.spaceGroups, function (spaceGroup) {
      return spaceGroup.gridOptions.data[0].name.length > 0;
    });
  };

  $scope.ok = function () {
    var data = [];
    _.each($scope.spaceGroups, function (spaceGroup) {
      data.push({
        config: spaceGroup.gridOptions.data[0],
        walls: spaceGroup.wallGridOptions.data[0]
      })
    });
    $modalInstance.close(data);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
