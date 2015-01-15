cbecc.controller('SpacesSettingsCtrl', ['$scope', 'uiGridConstants', 'Shared', 'Enums', function ($scope, uiGridConstants, Shared, Enums) {
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

  // Settings UI Grid
  $scope.settingsGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'space_function',
      enableHiding: false,
      cellEditableCondition: $scope.editableCondition,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.spaces_space_function_enums,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'occupant_density',
      displayName: 'Occupancy',
      secondLine: Shared.html('people / 1,000 ft<sup>2</sup>'),
      enableHiding: false,
      cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.occupant_density != row.entity.occupant_density_default) {
          return 'red-cell';
        }
      },
      cellEditableCondition: $scope.editableCondition,
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'hot_water_heating_rate',
      displayName: 'Hot Water Use',
      secondLine: Shared.html('gal / (hr person)'),
      enableHiding: false,
      cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.hot_water_heating_rate != row.entity.hot_water_heating_rate_default) {
          return 'red-cell';
        }
      },
      cellEditableCondition: $scope.editableCondition,
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'receptacle_power_density',
      displayName: 'Plug Loads',
      secondLine: Shared.html('W / ft<sup>2</sup>'),
      enableHiding: false,
      cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.receptacle_power_density != row.entity.receptacle_power_density_default) {
          return 'red-cell';
        }
      },
      cellEditableCondition: $scope.editableCondition,
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
            $scope.selected.space = row.entity;
          } else {
            // No rows selected
            $scope.selected.space = null;
          }
        }
      });
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        // Update unmodified defaults
        if (colDef.name == 'space_function' && newValue != oldValue) {
          // TODO Lookup space defaults
          if (rowEntity.occupant_density == rowEntity.occupant_density_default) {
            rowEntity.occupant_density = 10;
          }
          if (rowEntity.hot_water_heating_rate == rowEntity.hot_water_heating_rate_default) {
            rowEntity.hot_water_heating_rate = 0.18;
          }
          if (rowEntity.receptacle_power_density == rowEntity.receptacle_power_density_default) {
            rowEntity.receptacle_power_density = 1.5;
          }
          if (rowEntity.exhaust_per_area == rowEntity.exhaust_per_area_default) {
            rowEntity.exhaust_per_area = 10;
          }
          if (rowEntity.exhaust_air_changes_per_hour == rowEntity.exhaust_air_changes_per_hour_default) {
            rowEntity.exhaust_air_changes_per_hour = 0.18;
          }
          if (rowEntity.exhaust_per_space == rowEntity.exhaust_per_space_default) {
            rowEntity.exhaust_per_space = 250;
          }

          rowEntity.occupant_density_default = 10;
          rowEntity.hot_water_heating_rate_default = 0.18;
          rowEntity.receptacle_power_density_default = 1.5;

          rowEntity.exhaust_per_area_default = 10;
          rowEntity.exhaust_air_changes_per_hour_default = 0.18;
          rowEntity.exhaust_per_space_default = 250;

          gridApi.core.notifyDataChange(gridApi.grid, uiGridConstants.dataChange.EDIT);
        }
      });
    }
  };

  // Buttons
  $scope.applySettings = function () {
    $scope.applySettingsActive = true;
    $scope.data.clearAll($scope.gridApi);
    $scope.settingsGridOptions.multiSelect = true;
  };

  $scope.confirmApplySettings = function () {
    var replacement = {
      space_function: $scope.selected.space.space_function,
      occupant_density: $scope.selected.space.occupant_density,
      occupant_density_default: $scope.selected.space.occupant_density_default,
      hot_water_heating_rate: $scope.selected.space.hot_water_heating_rate,
      hot_water_heating_rate_default: $scope.selected.space.hot_water_heating_rate_default,
      receptacle_power_density: $scope.selected.space.receptacle_power_density,
      receptacle_power_density_default: $scope.selected.space.receptacle_power_density_default
    };
    var rows = $scope.gridApi.selection.getSelectedRows();
    _.each(rows, function (row) {
      _.merge(row, replacement);
      // Update unmodified exhaust values
      if (row.exhaust_per_area == row.exhaust_per_area_default) {
        row.exhaust_per_area = $scope.selected.space.exhaust_per_area_default;
      }
      if (row.exhaust_air_changes_per_hour == row.exhaust_air_changes_per_hour_default) {
        row.exhaust_air_changes_per_hour =  $scope.selected.space.exhaust_air_changes_per_hour_default;
      }
      if (row.exhaust_per_space == row.exhaust_per_space_default) {
        row.exhaust_per_space = $scope.selected.space.exhaust_per_space_default;
      }
      // Update exhaust defaults
      row.exhaust_per_area_default = $scope.selected.space.exhaust_per_area_default;
      row.exhaust_air_changes_per_hour_default = $scope.selected.space.exhaust_air_changes_per_hour_default;
      row.exhaust_per_space_default = $scope.selected.space.exhaust_per_space_default;
      $scope.data.updateTotalExhaust(row);
    });
    $scope.gridApi.core.notifyDataChange($scope.gridApi.grid, uiGridConstants.dataChange.EDIT);
    $scope.resetApplySettings();
  };

  $scope.resetApplySettings = function () {
    $scope.selected.space = null;
    $scope.applySettingsActive = false;
    $scope.data.clearAll($scope.gridApi);
    $scope.settingsGridOptions.multiSelect = false;
  };

}]);