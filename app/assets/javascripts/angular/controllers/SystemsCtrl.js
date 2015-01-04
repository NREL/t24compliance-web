cbecc.controller('SystemsCtrl', [
  '$scope', '$window', '$stateParams', '$resource', '$location', 'toaster', 'Shared', 'System', function ($scope, $window, $stateParams, $resource, $location, toaster, Shared, System) {
    // TODO:  get saved system and organize by types

    //collapsible panels
    $scope.systemPanels = [{
      title: 'VAV Air Systems',
      name: 'vavs',
      open: true
    }, {
      title: 'PVAV Air Systems',
      name: 'pvavs'
    }, {
      title: 'PTAC Zone Systems',
      name: 'ptacs'
    }, {
      title: 'MAU Air Systems',
      name: 'maus'
    }, {
      title: 'Exhaust Systems',
      name: 'exhausts'
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

    // put all systems DATA in array for panels
    $scope.systems = {};
    $scope.systems.ptacs = [];
    $scope.systems.vavs = [];
    $scope.systems.pvavs = [];
    $scope.systems.maus = [];
    $scope.systems.exhausts = [];

    // system tabs META
    // this is used to initialize the grids and render active vertical tabs in the view
    // TODO: add other tab defs
    $scope.systemTabs = {};
    $scope.systemTabs.ptacs = ['general','fan', 'coil_cooling', 'coil_heating'];

    //TODO: get systems by type
    gridCols = {};
    gridCols.ptacs = {};
    gridCols.ptacs.general = [{
      name: 'name',
      displayName: 'System Name'
    }, {
      name: 'status',
      displayName: 'Status'
    }, {
      name: 'fan_control',
      displayName: 'Fan Control Ration'
    }];
    gridCols.ptacs.fan = [{
      name: 'name',
      displayName: 'System Name'
    }, {
      name: 'fan_name',
      displayName: 'Fan Name',
      field: 'fan.name'
    },{
      name: 'fan_control_method',
      displayName: 'Control Method',
      field: 'fan.control_method'
    }, {
      name: 'fan_flow_efficiency',
      displayName: 'Flow Efficiency',
      field: 'fan.flow_efficiency'
    }, {
      name: 'fan_total_static_pressure',
      displayName: 'Total Static Pressure',
      field: 'fan.total_static_pressure'
    }, {
      name: 'fan_motor_position',
      displayName: 'Motor Position',
      field: 'fan.motor_position'
    }, {
      name: 'fan_motor_hp',
      displayName: 'Motor HP',
      field: 'fan.motor_hp'
    }, {
      name: 'fan_motor_type',
      displayName: 'Motor Type',
      field: 'fan.motor_type'
    }, {
      name: 'fan_motor_pole_count',
      displayName: 'Motor Pole Count',
      field: 'fan.motor_pole_count'
    }, {
      name: 'fan_motor_efficiency',
      displayName: 'Motor Efficiency',
      field: 'fan.motor_efficiency'
    }];
    gridCols.ptacs.coil_cooling = [{
      name: 'name',
      displayName: 'System Name'
    }, {
      name: 'coil_cooling_name',
      displayName: 'Coil Name',
      field: 'coil_cooling.name'
    },{
      name: 'coil_cooling_type',
      displayName: 'Type',
      field: 'coil_cooling.type'
    },{
      name: 'coil_cooling_fuel_source',
      displayName: 'Fuel Source',
      field: 'coil_cooling.fuel_source'
    },{
      name: 'coil_cooling_condenser_type',
      displayName: 'Condenser Type',
      field: 'coil_cooling.condenser_type'
    }];
    gridCols.ptacs.coil_heating = [{
      name: 'name',
      displayName: 'System Name'
    }, {
      name: 'coil_heating_name',
      displayName: 'Coil Name',
      field: 'coil_heating.name'
    },{
      name: 'coil_heating_type',
      displayName: 'Type',
      field: 'coil_heating.type'
    },{
      name: 'coil_cooling_fluid_segment_in_reference',
      displayName: 'Fluid Segment In',
      field: 'coil_heating.fluid_segment_in_reference'
    },{
      name: 'coil_cooling_fluid_segment_out_reference',
      displayName: 'Fluid Segment Out',
      field: 'coil_heating.fluid_segment_out_reference'
    }];

    // TODO: add other systems
    $scope.gridOptions = {};
    $scope.gridOptions.ptacs = {};
    $scope.systemTabs.ptacs.forEach(function(tab) {
      console.log(tab);
      $scope.gridOptions.ptacs[tab] = {
        columnDefs: gridCols.ptacs[tab],
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
      $scope.gridOptions.ptacs[tab].data = $scope.systems.ptacs;
    });

    function initTabs() {

      tabClasses = {};
      tabClasses.ptacs = {general: 'default', fan: 'default', coil_cooling: 'default', coil_heating: 'default'};
    }

    $scope.getTabClass = function (panelName, tabName) {
      return "btn btn-" + tabClasses[panelName][tabName];
    };

    $scope.setActiveTab = function (panelName, tabName) {
      initTabs();
      tabClasses[panelName][tabName] = "primary";
    };

    $scope.isActiveTab = function (panelName, tabName){
      if (tabClasses[panelName][tabName] === 'primary') {
        return true;
      }
      else {
        return false;
      }
    };

    // Initialize active tabs
    initTabs();
    $scope.setActiveTab('ptacs', 'general');


    // add functions  (adds entries in all grids across vertical tabs inside a panel)
    // TODO: add other systems
    $scope.addPTAC = function () {
      $scope.systems.ptacs.push({
        name: "PTAC " + ($scope.systems.ptacs.length + 1),
        status: 'New',
        type: 'PTAC',
        fan_control: 'Constant Volume',
        fan: {
          name: "Fan " + ($scope.systems.ptacs.length + 1),
          control_method: 'Constant Volume'
        },
        coil_cooling: {
          name: "Cooling Coil " + ($scope.systems.ptacs.length + 1)
        },
        coil_heating: {
          name: "Heating Coil " + ($scope.systems.ptacs.length + 1)
        }

      });
    };

    // save
    // TODO: add other systems
    $scope.submit = function () {
      console.log("submit");
      $scope.errors = {}; //clean up server errors

      console.log($scope.systems);

      function success(response) {
        toaster.pop('success', 'Systems successfully saved');
        console.log("redirecting to " + Shared.systemsPath());
        $location.path(Shared.systemsPath());

      }

      function failure(response) {
        console.log("failure", response);
        if (response.status == 422) {
          var len = Object.keys(response.data.errors).length;
          toaster.pop('error', 'An error occurred while saving', len + ' invalid field' + (len == 1 ? '' : 's'));
        } else {
          toaster.pop('error', 'An error occurred while saving');
        }
        angular.forEach(response.data.errors, function(errors, field) {
          $scope.form[field].$setValidity('server', false);
          $scope.form[field].$dirty = true;
          $scope.errors[field] = errors.join(', ');
        });
      }

      // collapse all system types into 1 array for saving
      systems = [];
      for (var type in $scope.systems) {
        $scope.systems[type].forEach(function (s) {
          systems.push(s);
        });
      }

      System.createUpdate({building_id: Shared.getBuildingId()}, systems, success, failure);

    };

  }
]);
