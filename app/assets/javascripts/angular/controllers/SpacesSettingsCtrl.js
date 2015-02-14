cbecc.controller('SpacesSettingsCtrl', ['$scope', 'uiGridConstants', 'Shared', 'Enums', function ($scope, uiGridConstants, Shared, Enums) {
  $scope.selected = {
    space: null
  };

  $scope.applySettingsActive = false;

  // Settings UI Grid
  $scope.settingsGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableHiding: false,
      cellEditableCondition: $scope.data.applySettingsCondition,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'space_function',
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.conditioning_type == 'Plenum') {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        if ($scope.grid.appScope.applySettingsActive) return false;
        return $scope.row.entity.conditioning_type != 'Plenum';
      },
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.spaces_space_function_enums,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'occupant_density',
      displayName: 'Occupancy',
      secondLine: Shared.html('people / 1,000 ft<sup>2</sup>'),
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.occupant_density != row.entity.occupant_density_default) {
          return 'modified-cell';
        }
        if (row.entity.conditioning_type == 'Plenum') {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        if ($scope.grid.appScope.applySettingsActive) return false;
        return $scope.row.entity.conditioning_type != 'Plenum';
      },
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'hot_water_heating_rate',
      displayName: 'Hot Water Use',
      secondLine: Shared.html('gal / (hr person)'),
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.hot_water_heating_rate != row.entity.hot_water_heating_rate_default) {
          return 'modified-cell';
        }
        if (row.entity.conditioning_type == 'Plenum') {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        if ($scope.grid.appScope.applySettingsActive) return false;
        return $scope.row.entity.conditioning_type != 'Plenum';
      },
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'receptacle_power_density',
      displayName: 'Plug Loads',
      secondLine: Shared.html('W / ft<sup>2</sup>'),
      enableHiding: false,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.receptacle_power_density != row.entity.receptacle_power_density_default) {
          return 'modified-cell';
        }
        if (row.entity.conditioning_type == 'Plenum') {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        if ($scope.grid.appScope.applySettingsActive) return false;
        return $scope.row.entity.conditioning_type != 'Plenum';
      },
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }],
    data: $scope.data.spaces,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    excessRows: 10,
    enableSelectAll: false,
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

          var spaceIndex = $scope.data.spaces.indexOf(rowEntity);
          if (colDef.name == 'name') {
            var unique = Shared.checkUnique($scope.data.spaces, newValue, spaceIndex);
            if (!unique) rowEntity.name = oldValue;
          } else if (colDef.name == 'space_function') {
            if (rowEntity.conditioning_type != 'Plenum') {
              $scope.updateSpaceFunction(rowEntity, spaceIndex, newValue, oldValue);
            }
          }
        }
      });
    }
  };

  $scope.updateSpaceFunction = function (rowEntity, spaceIndex, newValue, oldValue) {
    // Update unmodified defaults
    var defaults = _.find($scope.data.spaceFunctionDefaults, {
      name: newValue
    });

    if (rowEntity.occupant_density == rowEntity.occupant_density_default) {
      rowEntity.occupant_density = defaults.occupant_density;
    }
    if (rowEntity.hot_water_heating_rate == rowEntity.hot_water_heating_rate_default) {
      rowEntity.hot_water_heating_rate = defaults.hot_water_heating_rate;
    }
    if (rowEntity.receptacle_power_density == rowEntity.receptacle_power_density_default) {
      rowEntity.receptacle_power_density = defaults.receptacle_power_density;
    }
    if (rowEntity.exhaust_per_area == rowEntity.exhaust_per_area_default) {
      rowEntity.exhaust_per_area = defaults.exhaust_per_area;
    }
    if (rowEntity.exhaust_air_changes_per_hour == rowEntity.exhaust_air_changes_per_hour_default) {
      rowEntity.exhaust_air_changes_per_hour = defaults.exhaust_air_changes_per_hour;
    }
    if (rowEntity.commercial_refrigeration_epd == rowEntity.commercial_refrigeration_epd_default) {
      rowEntity.commercial_refrigeration_epd = defaults.commercial_refrigeration_epd;
    }
    if (rowEntity.gas_equipment_power_density == rowEntity.gas_equipment_power_density_default) {
      rowEntity.gas_equipment_power_density = defaults.gas_equipment_power_density;
    }
    if (rowEntity.interior_lighting_power_density_regulated == rowEntity.interior_lighting_power_density_regulated_default && rowEntity.lighting_input_method == 'LPD') {
      rowEntity.interior_lighting_power_density_regulated = defaults.interior_lighting_power_density_regulated;
    }
    if (rowEntity.interior_lighting_power_density_non_regulated == rowEntity.interior_lighting_power_density_non_regulated_default && rowEntity.lighting_input_method == 'LPD') {
      rowEntity.interior_lighting_power_density_non_regulated = defaults.interior_lighting_power_density_non_regulated;
    }

    rowEntity.occupant_density_default = defaults.occupant_density;
    rowEntity.hot_water_heating_rate_default = defaults.hot_water_heating_rate;
    rowEntity.receptacle_power_density_default = defaults.receptacle_power_density;
    rowEntity.exhaust_per_area_default = defaults.exhaust_per_area;
    rowEntity.exhaust_air_changes_per_hour_default = defaults.exhaust_air_changes_per_hour;

    // Schedules/Ventilation are not modifiable by the user
    rowEntity.function_schedule_group = defaults.function_schedule_group == '- specify -' ? null : defaults.function_schedule_group;
    rowEntity.ventilation_per_person = defaults.ventilation_per_person;
    rowEntity.ventilation_per_area = defaults.ventilation_per_area;
    rowEntity.ventilation_air_changes_per_hour = defaults.ventilation_air_changes_per_hour;

    rowEntity.total_exhaust = Shared.calculateTotalExhaust(rowEntity);

    rowEntity.commercial_refrigeration_epd_default = defaults.commercial_refrigeration_epd;

    rowEntity.gas_equipment_power_density_default = defaults.gas_equipment_power_density;

    rowEntity.interior_lighting_power_density_regulated_default = defaults.interior_lighting_power_density_regulated;
    rowEntity.interior_lighting_power_density_non_regulated_default = defaults.interior_lighting_power_density_non_regulated;

    if (_.contains(['High-Rise Residential Living Spaces', 'Hotel/Motel Guest Room'], newValue)) {
      if (rowEntity.lighting_input_method == 'Luminaires') {
        rowEntity.lighting_input_method = 'LPD';
        rowEntity.interior_lighting_power_density_regulated = defaults.interior_lighting_power_density_regulated;
        rowEntity.interior_lighting_power_density_non_regulated = defaults.interior_lighting_power_density_non_regulated;
        _.remove($scope.data.lightingSystems, {space: spaceIndex});
      }
    }

    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
  };

  // Buttons
  $scope.applySettings = function () {
    $scope.applySettingsActive = true;
    $scope.data.clearAll($scope.gridApi);
    $scope.settingsGridOptions.enableSelectAll = true;
    $scope.settingsGridOptions.multiSelect = true;
  };

  $scope.confirmApplySettings = function () {
    var selectedRowEntity = angular.copy($scope.selected.space);
    var selectedSpaceIndex = $scope.data.spaces.indexOf($scope.selected.space);

    _.each($scope.gridApi.selection.getSelectedGridRows(), function (row) {
      if (row.visible) {
        var rowEntity = row.entity;
        var spaceIndex = $scope.data.spaces.indexOf(rowEntity);

        if (spaceIndex != selectedSpaceIndex) {
          Shared.setModified();

          if (rowEntity.conditioning_type != 'Plenum') {
            rowEntity.space_function = $scope.selected.space.space_function;
            $scope.updateSpaceFunction(rowEntity, spaceIndex, $scope.selected.space.space_function, selectedRowEntity.space_function);

            rowEntity.occupant_density = $scope.selected.space.occupant_density;
            rowEntity.hot_water_heating_rate = $scope.selected.space.hot_water_heating_rate;
            rowEntity.receptacle_power_density = $scope.selected.space.receptacle_power_density;
          }
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
    $scope.settingsGridOptions.enableSelectAll = false;
    $scope.settingsGridOptions.multiSelect = false;
  };

}]);
