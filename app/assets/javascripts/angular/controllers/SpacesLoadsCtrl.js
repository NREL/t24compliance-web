cbecc.controller('SpacesLoadsCtrl', ['$scope', 'uiGridConstants', 'Shared', function ($scope, uiGridConstants, Shared) {
  $scope.selected = {
    space: null
  };

  $scope.applySettingsActive = false;

  // Loads UI Grid
  $scope.loadsGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableCellEdit: false,
      enableHiding: false,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits',
      filters: Shared.textFilter()
    }, {
      name: 'conditioning_type',
      enableFiltering: false,
      filters: Shared.notFilter('Plenum'),
      visible: false
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
    enableSelectAll: false,
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
    $scope.loadsGridOptions.enableSelectAll = true;
    $scope.loadsGridOptions.multiSelect = true;
  };

  $scope.confirmApplySettings = function () {
    var selectedSpaceIndex = $scope.data.spaces.indexOf($scope.selected.space);

    _.each($scope.gridApi.selection.getSelectedGridRows(), function (row) {
      if (row.visible) {
        var rowEntity = row.entity;
        var spaceIndex = $scope.data.spaces.indexOf(rowEntity);

        if (spaceIndex != selectedSpaceIndex) {
          Shared.setModified();

          rowEntity.process_electrical_power_density = $scope.selected.space.process_electrical_power_density;
          rowEntity.commercial_refrigeration_epd = $scope.selected.space.commercial_refrigeration_epd;
          rowEntity.elevator_count = $scope.selected.space.elevator_count;
          rowEntity.escalator_count = $scope.selected.space.escalator_count;
          rowEntity.process_electrical_radiation_fraction = $scope.selected.space.process_electrical_radiation_fraction;
          rowEntity.process_electrical_latent_fraction = $scope.selected.space.process_electrical_latent_fraction;
          rowEntity.process_electrical_lost_fraction = $scope.selected.space.process_electrical_lost_fraction;
          rowEntity.elevator_lost_fraction = $scope.selected.space.elevator_lost_fraction;
          rowEntity.escalator_lost_fraction = $scope.selected.space.escalator_lost_fraction;
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
    $scope.loadsGridOptions.enableSelectAll = false;
    $scope.loadsGridOptions.multiSelect = false;
  };

}]);
