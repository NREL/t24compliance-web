cbecc.controller('SpacesSettingsCtrl', ['$scope', 'Shared', 'Enums', function ($scope, Shared, Enums) {
  $scope.selected = {
    space: null
  };

  // Settings UI Grid
  $scope.settingsGridOptions = {
    columnDefs: [{
      name: 'name',
      displayName: 'Space Name',
      enableHiding: false,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
    }, {
      name: 'space_function',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      cellFilter: 'mapEnums:"spaces_space_function_enums"',
      editDropdownOptionsArray: Enums.enumsArr.spaces_space_function_enums,
      filter: Shared.enumFilter(Enums.enumsArr.spaces_space_function_enums),
      headerCellTemplate: 'ui-grid/customHeaderCell',
      sortingAlgorithm: Shared.sort(Enums.enumsArr.spaces_space_function_enums)
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
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
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
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/customHeaderCell'
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
        if (row.isSelected) {
          $scope.selected.space = row.entity;
        } else {
          // No rows selected
          $scope.selected.space = null;
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
}]);