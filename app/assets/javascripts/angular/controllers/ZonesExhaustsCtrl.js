cbecc.controller('ZonesExhaustsCtrl', ['$scope', 'uiGridConstants', 'Shared', 'Enums', function ($scope, uiGridConstants, Shared, Enums) {

  $scope.selected = {
    exhaust: null
  };

  // find all zones that contain a space that has exhaust
  var exhaustZonesArr = [];
  _.each(_.filter($scope.data.zones, {
    type: 'Conditioned'
  }), function (zone) {
    _.each(_.filter($scope.data.spaces, {
      thermal_zone_reference: zone.name
    }), function (space) {
      if (Shared.calculateTotalExhaust(space) > 0) {
        //console.log("TOTAL EXHAUST FOR ", space.name, ": ", Shared.calculateTotalExhaust(space) );
        exhaustZonesArr.push({
          id: zone.id,
          value: zone.name
        });
        // break when 1 space is found
        return false;
      }
    });
  });

  console.log("exhaustZonesArray");
  console.log(exhaustZonesArr);

  // compare exhaustZonesArr with $scope.data.exhausts to see if rows need to be added (for zones that have new spaces with exhaust)
  _.each(exhaustZonesArr, function (zone) {
    var match = _.find($scope.data.exhausts, {
      zone_id: zone.id
    });
    if (!match) {
      console.log("NO MATCH FOR zone id: ", zone.id);
      // add to array
      $scope.data.exhausts.push({
        zone_id: zone.id,
        zone_name: zone.value,
        name: zone.value + ' Exhaust System',
        type: 'Exhaust'
      });
    }
  });
  console.log("data.exhausts");
  console.log($scope.data.exhausts);


  var minWidth = 150;

  // Exhausts UI Grid
  $scope.exhaustsGridOptions = {
    columnDefs: [{
      name: 'zone_name',
      displayName: 'Thermal Zone',
      enableCellEdit: false,
      enableHiding: false,
      minWidth: minWidth,
      filter: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'fan_classification',
      displayName: 'Classification',
      field: 'fan.classification',
      enableHiding: false,
      minWidth: minWidth,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.fans_classification_enums,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'fan_control_method',
      displayName: 'Control Method',
      field: 'fan.control_method',
      enableHiding: false,
      minWidth: minWidth,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.fans_control_method_enums,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'type',
      displayName: 'Fan Type',
      field: 'fan.centrifugal_type',
      enableHiding: false,
      minWidth: minWidth,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.fans_centrifugal_type_enums,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'fan_flow_capacity',
      displayName: 'Flow Capacity',
      field: 'fan.flow_capacity',
      enableHiding: false,
      minWidth: minWidth,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'fan_flow_minimum',
      displayName: 'Flow Minimum',
      field: 'fan.flow_minimum',
      enableHiding: false,
      minWidth: minWidth,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'fan_modeling_method',
      displayName: 'Modeling Method',
      field: 'fan.modeling_method',
      enableHiding: false,
      minWidth: minWidth,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.fans_modeling_method_enums,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'fan_total_static_pressure',
      displayName: 'Total Static Pressure',
      field: 'fan.total_static_pressure',
      enableHiding: false,
      minWidth: minWidth + 20,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'fan_flow_efficiency',
      displayName: 'Fan Minimum',
      field: 'fan.flow_efficiency',
      enableHiding: false,
      minWidth: minWidth,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'fan_motor_bhp',
      displayName: 'Motor Brake HP',
      field: 'fan.motor_bhp',
      enableHiding: false,
      minWidth: minWidth,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'fan_motor_position',
      displayName: 'Motor Position',
      field: 'fan.motor_position',
      enableHiding: false,
      minWidth: minWidth,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.fans_motor_position_enums,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'fan_nameplate_hp',
      displayName: 'Nameplate HP',
      field: 'fan.motor_hp',
      enableHiding: false,
      minWidth: minWidth,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'fan_motor_type',
      displayName: 'Motor Type',
      field: 'fan.motor_type',
      enableHiding: false,
      minWidth: minWidth,
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.fans_motor_type_enums,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'fan_pole_count',
      displayName: 'Pole Count',
      field: 'fan.pole_count',
      enableHiding: false,
      minWidth: minWidth,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }, {
      name: 'fan_motor_efficiency',
      displayName: 'Motor Efficiency',
      field: 'fan.motor_efficiency',
      enableHiding: false,
      minWidth: minWidth,
      headerCellTemplate: 'ui-grid/cbeccHeaderCell'
    }],
    data: $scope.data.exhausts,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (row.isSelected) {
          $scope.selected.exhaust = row.entity;
        } else {
          // No rows selected
          $scope.selected.exhaust = null;
        }
      });
    }
  };

}]);
