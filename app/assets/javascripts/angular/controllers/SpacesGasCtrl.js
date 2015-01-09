cbecc.controller('SpacesGasCtrl', ['$scope', 'uiGridConstants', function ($scope, uiGridConstants) {
  $scope.selectedSpace = null;

  $scope.applySettingsActive = false;

  $scope.editableCondition = function ($scope) {
    while (!$scope.hasOwnProperty('applySettingsActive')) {
      $scope = $scope.$parent;
    }
    return !$scope.applySettingsActive;
  };

  // Natural Gas UI Grid
  $scope.gasGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableCellEdit: false,
      enableHiding: false,
      filter: angular.copy($scope.data.textFilter)
    }, {
      name: 'gas_equipment',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      type: 'number',
      filters: angular.copy($scope.data.numberFilter)
    }, {
      name: 'process_gas',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      type: 'number',
      filters: angular.copy($scope.data.numberFilter)
    }, {
      name: 'radiant_fraction',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      type: 'number',
      filters: angular.copy($scope.data.numberFilter)
    }, {
      name: 'latent_fraction',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      type: 'number',
      filters: angular.copy($scope.data.numberFilter)
    }, {
      name: 'lost_fraction',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      type: 'number',
      filters: angular.copy($scope.data.numberFilter)
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
            $scope.selectedSpace = row.entity;
          } else {
            // No rows selected
            $scope.selectedSpace = null;
          }
        }
      });
    }
  };

  // Buttons
  $scope.applySettings = function () {
    $scope.applySettingsActive = true;
    $scope.clearAll();
    $scope.gasGridOptions.multiSelect = true;
  };

  $scope.confirmApplySettings = function () {
    var replacement = {
      gas_equipment: $scope.selectedSpace.gas_equipment,
      process_gas: $scope.selectedSpace.process_gas,
      radiant_fraction: $scope.selectedSpace.radiant_fraction,
      latent_fraction: $scope.selectedSpace.latent_fraction,
      lost_fraction: $scope.selectedSpace.lost_fraction
    };
    var rows = $scope.gridApi.selection.getSelectedRows();
    _.each(rows, function (row) {
      _.merge(row, replacement);
    });
    $scope.resetApplySettings();
  };

  $scope.resetApplySettings = function () {
    $scope.selectedSpace = null;
    $scope.applySettingsActive = false;
    $scope.clearAll();
    $scope.gasGridOptions.multiSelect = false;
  };

  $scope.selectAll = function () {
    $scope.gridApi.selection.selectAllRows();
  };
  $scope.clearAll = function () {
    $scope.gridApi.selection.clearSelectedRows();
  };

}]);
