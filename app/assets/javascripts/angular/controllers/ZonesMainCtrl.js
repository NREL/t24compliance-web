cbecc.controller('ZonesMainCtrl', ['$scope', 'uiGridConstants', 'Shared', 'Enums', function ($scope, uiGridConstants, Shared, Enums) {
  $scope.selected = {
    zone: null
  };

  $scope.applySettingsActive = false;

  // Zones UI Grid
  $scope.zonesGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Thermal Zone Name',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      filter: Shared.textFilter()
      // }, {
      //   name: 'building_story_id',
      //   displayName: 'Story',
      //   enableHiding: false,
      //   cellEditableCondition: $scope.data.applySettingsCondition,
      //   editableCellTemplate: 'ui-grid/dropdownEditor',
      //   cellFilter: 'mapHash:grid.appScope.data.storiesHash',
      //   editDropdownOptionsArray: $scope.data.storiesArr,
      //   filter: Shared.enumFilter($scope.data.storiesHash),
      //   sortingAlgorithm: Shared.sort($scope.data.storiesHash)
    }, {
      name: 'type',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.zones_type_enums
    }],
    data: $scope.data.zones,
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
            $scope.selected.zone = row.entity;
          } else {
            // No rows selected
            $scope.selected.zone = null;
          }
        }
      });
    }
  };

  // Buttons
  $scope.applySettings = function () {
    $scope.applySettingsActive = true;
    $scope.data.clearAll($scope.gridApi);
    $scope.zonesGridOptions.multiSelect = true;
  };

  $scope.confirmApplySettings = function () {
    var replacement = {
      type: $scope.selected.zone.type
    };
    var rows = $scope.gridApi.selection.getSelectedRows();
    _.each(rows, function (row) {
      _.merge(row, replacement);
    });
    $scope.gridApi.core.notifyDataChange($scope.gridApi.grid, uiGridConstants.dataChange.EDIT);
    $scope.resetApplySettings();
  };

  $scope.resetApplySettings = function () {
    $scope.selected.zone = null;
    $scope.applySettingsActive = false;
    $scope.data.clearAll($scope.gridApi);
    $scope.zonesGridOptions.multiSelect = false;
  };

}]);
