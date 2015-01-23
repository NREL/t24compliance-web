cbecc.controller('ZonesTerminalsCtrl', ['$scope', 'Shared', 'Enums', function ($scope, Shared, Enums) {
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
      console.log('SYSTEM:' + system);
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
      console.log("NO MATCH FOR zone name: ", zone.name);
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
  min_width = 160;
  $scope.terminalsGridOptions = {
    columnDefs: [{
      name: 'zone_served_reference',
      displayName: 'Thermal Zone',
      enableHiding: false,
      enableCellEdit: false,
      minWidth: min_width,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'name',
      displayName: 'Terminal Name',
      enableHiding: false,
      filter: Shared.textFilter(),
      minWidth: min_width,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'type',
      displayName: 'Terminal Type',
      enableHiding: false,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.terminal_units_type_enums,
      filter: Shared.textFilter(),
      minWidth: min_width,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'primary_air_flow_maximum',
      displayName: 'Max. Primary Flow',
      enableHiding: false,
      filter: Shared.numberFilter(),
      minWidth: min_width,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'primary_air_flow_minimum',
      displayName: 'Min. Primary Flow',
      enableHiding: false,
      filter: Shared.numberFilter(),
      minWidth: min_width,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'heating_air_flow_maximum',
      displayName: 'Max. Heating Flow',
      enableHiding: false,
      filter: Shared.numberFilter(),
      minWidth: min_width,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'reheat_control_method',
      displayName: 'Max. Heating Flow',
      enableHiding: false,
      filter: Shared.textFilter(),
      editableCellTemplate: 'ui-grid/dropdownEditor',
      minWidth: min_width,
      editDropdownOptionsArray: Enums.enumsArr.terminal_units_reheat_control_method_enums,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'induced_air_zone_reference',
      displayName: 'Induced Air Zone',
      enableHiding: false,
      filter: Shared.textFilter(),
      minWidth: min_width,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'induction_ratio',
      displayName: 'Induction Ratio',
      enableHiding: false,
      filter: Shared.numberFilter(),
      minWidth: min_width,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'fan_power_per_flow',
      displayName: 'Terminal Fan Power',
      enableHiding: false,
      filter: Shared.numberFilter(),
      minWidth: min_width + 20,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'parallel_box_fan_flow_fraction',
      displayName: 'Parallel Box Flow Frac.',
      enableHiding: false,
      filter: Shared.numberFilter(),
      minWidth: min_width + 20,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
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
    }
  };

}]);
