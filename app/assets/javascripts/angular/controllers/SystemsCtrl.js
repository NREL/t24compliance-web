cbecc.controller('SystemsCtrl', [
  '$scope', '$window', '$routeParams', '$resource', '$location', 'Shared', function ($scope, $window, $routeParams, $resource, $location, Shared) {
    //collapsible panels
    $scope.systemPanels = [{
      title: 'VAV Air Systems',
      name: 'VAV',
      open: true
    }, {
      title: 'PVAV Air Systems',
      name: 'PVAV'
    }, {
      title: 'PTAC Zone Systems',
      name: 'PTAC'
    }, {
      title: 'MAU Air Systems',
      name: 'MAU'
    }, {
      title: 'Exhaust Systems',
      name: 'Exhaust'
    }];

    $scope.plantPanels = [{
      title: 'Service Hot Water'
    }, {
      title: 'Chilled Water Plant'
    }, {
      title: 'Hot Water Plant'
    }, {
      title: 'Condenser Plant'
    }];

    function initTabs() {
      tabClasses = {};
      tabClasses['ptac']  = ["default","default","default","default","default"];
    }

    $scope.getTabClass = function (panelName, tabNum) {
      return "btn btn-" + tabClasses[panelName][tabNum];
    };

    $scope.setActiveTab = function (panelName, tabNum) {
      initTabs();
      tabClasses[panelName][tabNum] = "primary";
    };

    $scope.isActiveTab = function (panelName, tabNum){
      if (tabClasses[panelName][tabNum] === 'primary') {
        return true;
      }
      else {
        return false;
      }
    };

    //Initialize
    initTabs();
    $scope.setActiveTab('ptac', 0);

    //TODO: get systems by type
    $scope.ptacs = [];

    // PTAC general UI Grid
    $scope.ptacGridOptions = {
      columnDefs: [{
        name: 'name',
        displayName: 'System Name'
      }, {
        name: 'status',
        displayName: 'Status'
      }, {
        name: 'fan_control',
        displayName: 'Fan Control Ration'
      }],
      enableCellEditOnFocus: true,
      enableColumnMenus: false,
      enableRowHeaderSelection: true,
      enableRowSelection: true,
      enableSorting: false,
      multiSelect: false,
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          if (row.isSelected) {
            $scope.selected = row.entity;
          } else {
            // No rows selected
            $scope.selected = null;
          }
        });
      }
    };
    $scope.ptacGridOptions.data = $scope.ptacs;

    // PTAC fan UI Grid
    $scope.ptacFanGridOptions = {
      columnDefs: [{
        name: 'name',
        displayName: 'System Name'
      }, {
        name: 'fan_name',
        displayName: 'Fan Name'
      },{
        name: 'fan_control_method',
        displayName: 'Control Method'
      }, {
        name: 'fan_flow_efficiency',
        displayName: 'Flow Efficiency'
      }, {
        name: 'fan_total_static_pressure',
        displayName: 'Total Static Pressure'
      }, {
        name: 'fan_motor_position',
        displayName: 'Motor Position'
      }, {
        name: 'fan_motor_hp',
        displayName: 'Motor HP'
      }, {
        name: 'fan_motor_type',
        displayName: 'Motor Type'
      }, {
        name: 'fan_motor_pole_count',
        displayName: 'Motor Pole Count'
      }, {
        name: 'fan_motor_efficiency',
        displayName: 'Motor Efficiency'
      }],
      enableCellEditOnFocus: true,
      enableColumnMenus: false,
      enableRowHeaderSelection: true,
      enableRowSelection: true,
      enableSorting: false,
      multiSelect: false,
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          if (row.isSelected) {
            $scope.selected = row.entity;
          } else {
            // No rows selected
            $scope.selected = null;
          }
        });
      }
    };
    $scope.ptacFanGridOptions.data = $scope.ptacs;
    // cooling coil
    $scope.ptacCoolGridOptions = {
      columnDefs: [{
        name: 'name',
        displayName: 'System Name'
      }, {
        name: 'coil_cooling_name',
        displayName: 'Coil Name'
      },{
        name: 'coil_cooling_type',
        displayName: 'Type'
      },{
        name: 'coil_cooling_fuel_source',
        displayName: 'Fuel Source'
      },{
          name: 'coil_cooling_condenser_type',
          displayName: 'Condenser Type'
      }],
      enableCellEditOnFocus: true,
      enableColumnMenus: false,
      enableRowHeaderSelection: true,
      enableRowSelection: true,
      enableSorting: false,
      multiSelect: false,
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          if (row.isSelected) {
            $scope.selected = row.entity;
          } else {
            // No rows selected
            $scope.selected = null;
          }
        });
      }
    };
    $scope.ptacCoolGridOptions.data = $scope.ptacs;
    // heating coil
    $scope.ptacHeatGridOptions = {
      columnDefs: [{
        name: 'name',
        displayName: 'System Name'
      }, {
        name: 'coil_heating_name',
        displayName: 'Coil Name'
      },{
        name: 'coil_heating_type',
        displayName: 'Type'
      },{
        name: 'coil_cooling_fluid_segment_in_reference',
        displayName: 'Fluid Segment In'
      },{
        name: 'coil_cooling_fluid_segment_out_reference',
        displayName: 'Fluid Segment Out'
      }],
      enableCellEditOnFocus: true,
      enableColumnMenus: false,
      enableRowHeaderSelection: true,
      enableRowSelection: true,
      enableSorting: false,
      multiSelect: false,
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          if (row.isSelected) {
            $scope.selected = row.entity;
          } else {
            // No rows selected
            $scope.selected = null;
          }
        });
      }
    };
    $scope.ptacHeatGridOptions.data = $scope.ptacs;

    // add functions
    // TODO: this should add entries in all grids across vertical tabs
    $scope.addPTAC = function () {
      $scope.ptacs.push({
        name: "PTAC " + ($scope.ptacs.length + 1),
        status: 'New',
        fan_control: 'Constant Volume',
        fan_name: "Fan " + ($scope.ptacs.length + 1),
        fan_control_method: 'Constant Volume',
        coil_cooling_name: "Cooling Coil " + ($scope.ptacs.length + 1),
        coil_heating_name: "Heating Coil " + ($scope.ptacs.length + 1)

      });
    };

  }
]);
