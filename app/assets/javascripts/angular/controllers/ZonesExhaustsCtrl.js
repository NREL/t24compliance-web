cbecc.controller('ZonesExhaustsCtrl', ['$scope', '$log', 'uiGridConstants', 'Shared', 'Enums', function ($scope, $log, uiGridConstants, Shared, Enums) {
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
        //$log.debug('TOTAL EXHAUST FOR ', space.name, ': ', Shared.calculateTotalExhaust(space) );
        exhaustZonesArr.push({
          id: zone.id,
          value: zone.name
        });
        // break when 1 space is found
        return false;
      }
    });
  });

  $log.debug('exhaustZonesArray');
  $log.debug(exhaustZonesArr);

  // compare exhaustZonesArr with $scope.data.exhausts to see if rows need to be added (for zones that have new spaces with exhaust)
  _.each(exhaustZonesArr, function (zone) {
    var match = _.find($scope.data.exhausts, {
      zone_id: zone.id
    });
    if (!match) {
      $log.debug('NO MATCH FOR zone id: ', zone.id);
      // add to array
      $scope.data.exhausts.push({
        zone_id: zone.id,
        zone_name: zone.value,
        name: zone.value + ' Exhaust System',
        type: 'Exhaust',
        fan: {
          name: zone.value + ' Exhaust Fan'
        }
      });
    }
  });
  $log.debug('data.exhausts');
  $log.debug($scope.data.exhausts);


  var min_width = 150;

  // Exhausts UI Grid
  $scope.exhaustsGridOptions = {
    columnDefs: [{
      name: 'zone_name',
      displayName: 'Thermal Zone',
      enableCellEdit: false,
      enableHiding: false,
      minWidth: min_width,
      pinnedLeft: true,
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'fan_classification',
      displayName: 'Classification',
      field: 'fan.classification',
      enableHiding: false,
      minWidth: min_width,
      filters: Shared.textFilter(),
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.fans_classification_enums,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'fan_centrifugal_type',
      displayName: 'Fan Centrifugal Type',
      field: 'fan.centrifugal_type',
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.fans_centrifugal_type_enums,
      enableHiding: false,
      minWidth: min_width + 20,
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.fan.classification != 'Centrifugal') {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.fan.classification == 'Centrifugal');
      },
      filters: Shared.textFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'fan_modeling_method',
      displayName: 'Modeling Method',
      field: 'fan.modeling_method',
      enableHiding: false,
      minWidth: min_width,
      filters: Shared.textFilter(),
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.fans_modeling_method_enums,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'fan_control_method',
      displayName: 'Control Method',
      field: 'fan.control_method',
      enableHiding: false,
      minWidth: min_width,
      filters: Shared.textFilter(),
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.fans_control_method_enums,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'fan_flow_efficiency',
      displayName: 'Fan Minimum',
      field: 'fan.flow_efficiency',
      enableHiding: false,
      minWidth: min_width,
      type: 'number',
      filters: Shared.numberFilter(),
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.fan.modeling_method != 'StaticPressure') {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.fan.modeling_method == 'StaticPressure');
      },
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'fan_total_static_pressure',
      displayName: 'Total Static Pressure',
      field: 'fan.total_static_pressure',
      enableHiding: false,
      minWidth: min_width + 20,
      type: 'number',
      filters: Shared.numberFilter(),
      secondLine: Shared.html('ft H<sub>2</sub>O'),
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.fan.modeling_method != 'StaticPressure') {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.fan.modeling_method == 'StaticPressure');
      },
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'fan_motor_bhp',
      displayName: 'Motor Brake HP',
      secondLine: Shared.html('hp'),
      field: 'fan.motor_bhp',
      enableHiding: false,
      minWidth: min_width,
      type: 'number',
      filters: Shared.numberFilter(),
      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        if (row.entity.fan.modeling_method != 'BrakeHorsePower') {
          return 'disabled-cell';
        }
      },
      cellEditableCondition: function ($scope) {
        return ($scope.row.entity.fan.modeling_method == 'BrakeHorsePower');
      },
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'fan_motor_position',
      displayName: 'Motor Position',
      field: 'fan.motor_position',
      enableHiding: false,
      minWidth: min_width,
      filters: Shared.textFilter(),
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.fans_motor_position_enums,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'fan_nameplate_hp',
      displayName: 'Nameplate HP',
      secondLine: Shared.html('hp'),
      field: 'fan.motor_hp',
      enableHiding: false,
      minWidth: min_width,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'fan_motor_type',
      displayName: 'Motor Type',
      field: 'fan.motor_type',
      enableHiding: false,
      minWidth: min_width,
      filters: Shared.textFilter(),
      editableCellTemplate: 'ui-grid/dropdownEditor',
      editDropdownOptionsArray: Enums.enumsArr.fans_motor_type_enums,
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'fan_pole_count',
      displayName: 'Pole Count',
      field: 'fan.pole_count',
      enableHiding: false,
      minWidth: min_width,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }, {
      name: 'fan_motor_efficiency',
      displayName: 'Motor Efficiency',
      field: 'fan.motor_efficiency',
      enableHiding: false,
      minWidth: min_width,
      type: 'number',
      filters: Shared.numberFilter(),
      headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
    }],
    data: $scope.data.exhausts,
    enableCellEditOnFocus: true,
    enableFiltering: true,
    enablePinning: false,
    enableRowHeaderSelection: true,
    enableRowSelection: true,
    multiSelect: false,
    onRegisterApi: function (gridApi) {
      $scope.gridApi = gridApi;

      // For some reason this is necessary with pinned columns to get the header row height correct
      gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);

      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        if (row.isSelected) {
          $scope.selected.exhaust = row.entity;
        } else {
          // No rows selected
          $scope.selected.exhaust = null;
        }
      });
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
        if (newValue != oldValue) {
          Shared.setModified();

          if (colDef.name == 'fan_classification') {
            rowEntity.fan.centrifugal_type = null;
            gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
          } else if (colDef.name == 'fan_modeling_method') {
            rowEntity.fan.motor_bhp = null;
            rowEntity.fan.flow_efficiency = null;
            rowEntity.fan.total_static_pressure = null;
            gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
          }
        }
      });
    }
  };

}]);
