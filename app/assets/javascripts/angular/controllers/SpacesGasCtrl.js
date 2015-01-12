cbecc.controller('SpacesGasCtrl', ['$scope', 'uiGridConstants', 'Shared', function ($scope, uiGridConstants, Shared) {
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
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'gas_equipment',
      secondLine: Shared.html('Btu / (hr ft<sup>2</sup>)'),
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'process_gas',
      secondLine: Shared.html('Btu / (hr ft<sup>2</sup>)'),
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'gas_radiant_fraction',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'gas_latent_fraction',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'gas_lost_fraction',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
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
    $scope.data.clearAll($scope.gridApi);
    $scope.gasGridOptions.multiSelect = true;
  };

  $scope.confirmApplySettings = function () {
    var replacement = {
      gas_equipment: $scope.selectedSpace.gas_equipment,
      process_gas: $scope.selectedSpace.process_gas,
      gas_radiant_fraction: $scope.selectedSpace.gas_radiant_fraction,
      gas_latent_fraction: $scope.selectedSpace.gas_latent_fraction,
      gas_lost_fraction: $scope.selectedSpace.gas_lost_fraction
    };
    var rows = $scope.gridApi.selection.getSelectedRows();
    _.each(rows, function (row) {
      _.merge(row, replacement);
    });
    $scope.gridApi.core.notifyDataChange($scope.gridApi.grid, uiGridConstants.dataChange.EDIT);
    $scope.resetApplySettings();
  };

  $scope.resetApplySettings = function () {
    $scope.selectedSpace = null;
    $scope.applySettingsActive = false;
    $scope.data.clearAll($scope.gridApi);
    $scope.gasGridOptions.multiSelect = false;
  };

}]);
