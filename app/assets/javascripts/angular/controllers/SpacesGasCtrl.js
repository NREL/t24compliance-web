cbecc.controller('SpacesGasCtrl', ['$scope', 'uiGridConstants', 'Shared', function ($scope, uiGridConstants, Shared) {
  $scope.selected = {
    space: null
  };

  $scope.applySettingsActive = false;

  // Natural Gas UI Grid
  $scope.gasGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableCellEdit: false,
      enableHiding: false,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'conditioning_type',
      enableFiltering: false,
      filters: Shared.notFilter('Plenum'),
      visible: false
    }, {
      name: 'gas_equipment_power_density',
      displayName: 'Gas Equipment',
      secondLine: Shared.html('Btu / (hr ft<sup>2</sup>)'),
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.gas_equipment_power_density != row.entity.gas_equipment_power_density_default) {
          return 'modified-cell';
        }
      },
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
    excessRows: 10,
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
        if (newValue != oldValue) {
          Shared.setModified();
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
    var selectedSpaceIndex = $scope.data.spaces.indexOf($scope.selected.space);

    _.each($scope.gridApi.selection.getSelectedGridRows(), function (row) {
      if (row.visible) {
        var rowEntity = row.entity;
        var spaceIndex = $scope.data.spaces.indexOf(rowEntity);

        if (spaceIndex != selectedSpaceIndex) {
          Shared.setModified();

          rowEntity.gas_equipment_power_density = $scope.selected.space.gas_equipment_power_density;
          rowEntity.process_gas_power_density = $scope.selected.space.process_gas_power_density;
          rowEntity.process_gas_radiation_fraction = $scope.selected.space.process_gas_radiation_fraction;
          rowEntity.process_gas_latent_fraction = $scope.selected.space.process_gas_latent_fraction;
          rowEntity.process_gas_lost_fraction = $scope.selected.space.process_gas_lost_fraction;
        }
      }
    });
    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    $scope.resetApplySettings();
  };

  $scope.resetApplySettings = function () {
    $scope.selected.space = null;
    $scope.applySettingsActive = false;
    $scope.data.clearAll($scope.gridApi);
    $scope.gasGridOptions.multiSelect = false;
  };

}]);
