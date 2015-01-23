cbecc.controller('SpacesGasCtrl', ['$scope', 'uiGridConstants', 'Shared', function ($scope, uiGridConstants, Shared) {
  $scope.selectedSpace = null;

  $scope.applySettingsActive = false;

  // Natural Gas UI Grid
  $scope.gasGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableCellEdit: false,
      enableHiding: false,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'gas_equipment_power_density',
      displayName: 'Gas Equipment',
      secondLine: Shared.html('Btu / (hr ft<sup>2</sup>)'),
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'process_gas_power_density',
      displayName: 'Process Gas',
      secondLine: Shared.html('Btu / (hr ft<sup>2</sup>)'),
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'process_gas_radiation_fraction',
      displayName: 'Gas Radiant Fraction',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'process_gas_latent_fraction',
      displayName: 'Gas Latent Fraction',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'process_gas_lost_fraction',
      displayName: 'Gas Lost Fraction',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      type: 'number',
      filters: Shared.numberFilter(),
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
