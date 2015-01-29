cbecc.controller('ZonesTerminalsCtrl', ['$scope', '$log', 'Shared', 'Enums', function ($scope, $log, Shared, Enums) {
  $scope.selected = {
    zone: null
  };

  // find all zones with an HVAC reference that requires a terminal  (SZAC, PVAV, VAV)
  var terminalZonesArr = [];
  _.each(_.filter($scope.data.zones, {
    type: 'Conditioned'
  }), function (zone) {

    var system = _.find($scope.data.systems, {name: zone.primary_air_conditioning_system_reference});

    if (system != null) {
      $log.debug('SYSTEM:' + system);
      if (_.contains(['SZAC', 'VAV', 'PVAV'], system.type)) {
        terminalZonesArr.push({
          id: zone.id,
          name: zone.name,
          system_type: system.type,
          air_system_id: system.id
        });
      }
    }
  });

  // compare terminalZonesArr with $scope.data.terminals to see if rows need to be added (for new zone)
  _.each(terminalZonesArr, function (zone) {
    var match = _.find($scope.data.terminals, {
      zone_served_reference: zone.name
    });
    if (!match) {
      $log.debug("NO MATCH FOR zone name: ", zone.name);
      // determine defaults based on system type
      var terminal_type = "";
      if (zone.system_type === 'SZAC') {
        terminal_type = "Uncontrolled";
      }
      else if (zone.system_type === 'PVAV') {
        terminal_type = "VAVReheatBox";
      }
      // add to array
      $scope.data.terminals.push({
        zone_served_reference: zone.name,
        name: zone.name + ' Terminal',
        type: terminal_type,
        air_system_id: zone.air_system_id
      });

    }
  });

  // Systems UI Grid
  var min_width = 160;
  $scope.terminalsGridOptions = {
    columnDefs: [{
      name: 'zone_served_reference',
      displayName: 'Thermal Zone',
      enableHiding: false,
      enableCellEdit: false,
      minWidth: min_width,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'name',
      displayName: 'Terminal Name',
      enableHiding: false,
      filter: Shared.textFilter(),
      minWidth: min_width,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'type',
      displayName: 'Terminal Type',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.terminal_units_type_enums,
      filter: Shared.textFilter(),
      minWidth: min_width,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'primary_air_flow_maximum',
      displayName: 'Max. Primary Flow',
      enableHiding: false,
      filter: Shared.numberFilter(),
      minWidth: min_width,
      secondLine: Shared.html('cfm'),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'primary_air_flow_minimum',
      displayName: 'Min. Primary Flow',
      enableHiding: false,
      filter: Shared.numberFilter(),
      minWidth: min_width,
      secondLine: Shared.html('cfm'),
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.type == 'Uncontrolled') {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.type != 'Uncontrolled');
      },
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
      }, {
      name: 'heating_air_flow_maximum',
      displayName: 'Max. Heating Flow',
      enableHiding: false,
      filter: Shared.numberFilter(),
      minWidth: min_width,
      secondLine: Shared.html('cfm'),
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.type != 'VAVReheatBox') {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.type == 'VAVReheatBox');
      },
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'reheat_control_method',
      displayName: 'Max. Heating Flow',
      enableHiding: false,
      filter: Shared.textFilter(),
      editableCellTemplate: 'ui-grid/dropdownEditor',
      minWidth: min_width,
      editDropdownOptionsArray: Enums.enumsArr.terminal_units_reheat_control_method_enums,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.type != 'VAVReheatBox') {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.type == 'VAVReheatBox');
      },
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'induced_air_zone_reference',
      displayName: 'Induced Air Zone',
      enableHiding: false,
      filter: Shared.textFilter(),
      minWidth: min_width,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.type.indexOf('Fan') == -1) {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.type.indexOf('Fan') > -1 );
      },
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'induction_ratio',
      displayName: 'Induction Ratio',
      enableHiding: false,
      filter: Shared.numberFilter(),
      minWidth: min_width,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.type.indexOf('Fan') == -1) {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.type.indexOf('Fan') > -1 );
      },
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'fan_power_per_flow',
      displayName: 'Terminal Fan Power',
      enableHiding: false,
      filter: Shared.numberFilter(),
      minWidth: min_width + 20,
      secondLine: Shared.html('W/cfm'),
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.type.indexOf('Fan') == -1) {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.type.indexOf('Fan') > -1 );
      },
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'parallel_box_fan_flow_fraction',
      displayName: 'Parallel Box Flow Frac.',
      enableHiding: false,
      filter: Shared.numberFilter(),
      minWidth: min_width + 20,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.type.indexOf('Fan') == -1) {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.type.indexOf('Fan') > -1 );
      },
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }],
    data: $scope.data.terminals,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (row.isSelected) {
          $scope.selected.terminal = row.entity;
        } else {
          // No rows selected
          $scope.selected.terminal = null;
        }
      });
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if (newValue != oldValue) {
          Shared.setModified();
        }

        if (colDef.name == 'type') {
          // todo: see if we need to null any fields (the ones that now become N/A)
          if (newValue == 'Uncontrolled') {
            rowEntity.parallel_box_fan_flow_fraction = null;
            rowEntity.fan_power_per_flow = null;
            rowEntity.induction_ratio = null;
            rowEntity.induced_air_zone_reference = null;
            rowEntity.reheat_control_method = null;
            rowEntity.heating_air_flow_maximum = null;
            rowEntity.primary_air_flow_minimum = null;
          }
          else if (newValue == 'VAVNoReheatBox') {
            rowEntity.parallel_box_fan_flow_fraction = null;
            rowEntity.fan_power_per_flow = null;
            rowEntity.induction_ratio = null;
            rowEntity.induced_air_zone_reference = null;
            rowEntity.reheat_control_method = null;
            rowEntity.heating_air_flow_maximum = null;
          }
          else if (newValue == 'VAVReheatBox') {
            rowEntity.parallel_box_fan_flow_fraction = null;
            rowEntity.fan_power_per_flow = null;
            rowEntity.induction_ratio = null;
            rowEntity.induced_air_zone_reference = null;
          }
          else if (newValue == 'ParallelFanBox' || newValue == 'SeriesFanBox'){
            rowEntity.reheat_control_method = null;
            rowEntity.heating_air_flow_maximum = null;
          }


          gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        }

      });
    }
  };

}]);
