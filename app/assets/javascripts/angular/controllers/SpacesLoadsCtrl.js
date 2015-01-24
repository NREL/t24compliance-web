cbecc.controller('SpacesLoadsCtrl', ['$scope', 'uiGridConstants', 'Shared', function ($scope, uiGridConstants, Shared) {
  $scope.selectedSpace = null;

  $scope.applySettingsActive = false;

  // Loads UI Grid
  $scope.loadsGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableCellEdit: false,
      enableHiding: false,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      filter: Shared.textFilter()
    }, {
      name: 'process_electrical_power_density',
      displayName: 'Process Electric',
      secondLine: Shared.html('W / ft<sup>2</sup>'),
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'commercial_refrigeration_epd',
      displayName: 'Refrigeration',
      secondLine: Shared.html('W / ft<sup>2</sup>'),
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.commercial_refrigeration_epd != row.entity.commercial_refrigeration_epd_default) {
          return 'modified-cell';
        }
      },
      cellEditableCondition: $scope.data.applySettingsCondition,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'elevator_count',
      secondLine: Shared.html('ElevMech / Space'),
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'escalator_count',
      secondLine: Shared.html('Escal / Space'),
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'process_electrical_radiation_fraction',
      displayName: 'Loads Radiant Fraction',
      enableHiding: false,
      cellClass: 'border-left-cell',
      headerCellClass: 'border-left-cell',
      cellEditableCondition: $scope.data.applySettingsCondition,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'process_electrical_latent_fraction',
      displayName: 'Loads Latent Fraction',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'process_electrical_lost_fraction',
      displayName: 'Loads Lost Fraction',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'elevator_lost_fraction',
      enableHiding: false,
      cellClass: 'border-left-cell',
      headerCellClass: 'border-left-cell',
      cellEditableCondition: $scope.data.applySettingsCondition,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      type: 'number',
      filters: Shared.numberFilter()
    }, {
      name: 'escalator_lost_fraction',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      type: 'number',
      filters: Shared.numberFilter()
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
    $scope.loadsGridOptions.multiSelect = true;
  };

  $scope.confirmApplySettings = function () {
    var replacement = {
      process_electric: $scope.selectedSpace.process_electric,
      refrigeration: $scope.selectedSpace.refrigeration,
      elevator_count: $scope.selectedSpace.elevator_count,
      escalator_count: $scope.selectedSpace.escalator_count,
      loads_radiant_fraction: $scope.selectedSpace.loads_radiant_fraction,
      loads_latent_fraction: $scope.selectedSpace.loads_latent_fraction,
      loads_lost_fraction: $scope.selectedSpace.loads_lost_fraction,
      elevator_lost_fraction: $scope.selectedSpace.elevator_lost_fraction,
      escalator_lost_fraction: $scope.selectedSpace.escalator_lost_fraction
    };
    var rows = $scope.gridApi.selection.getSelectedRows();
    _.each(rows, function (row) {
      _.merge(row, replacement);
    });
    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    $scope.resetApplySettings();
  };

  $scope.resetApplySettings = function () {
    $scope.selectedSpace = null;
    $scope.applySettingsActive = false;
    $scope.data.clearAll($scope.gridApi);
    $scope.loadsGridOptions.multiSelect = false;
  };

}]);
