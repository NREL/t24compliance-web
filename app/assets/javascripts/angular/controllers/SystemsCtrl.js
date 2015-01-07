cbecc.controller('SystemsCtrl', [
  '$scope', '$stateParams', '$resource', '$location', '$modal', 'toaster', 'Shared', 'System', function ($scope, $stateParams, $resource, $location, $modal, toaster, Shared, System) {
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
      title: 'Service Hot Water',
      name: 'shw'
    }, {
      title: 'Chilled Water Plant',
      name: 'chilled_water'
    }, {
      title: 'Hot Water Plant',
      name: 'hot_water'
    }, {
      title: 'Condenser Plant',
      name: 'condenser'
    }];

    // put all systems DATA in array for panels
    $scope.systems = {
      ptacs: [],
      fpfc: [],
      vavs: [],
      pvavs: [],
      maus: [],
      exhausts: []
    };

    // same for plants
    $scope.plants = {};
    $scope.plants.shw = {};
    $scope.plants.hot_water = {};
    $scope.plants.chilled_water = {};
    $scope.plants.condenser = {};

    // system tabs META
    // this is used to initialize the grids and render active vertical tabs in the view
    // TODO: add other tab defs
    $scope.systemTabs = {};
    $scope.systemTabs.ptacs = ['general', 'fan', 'coil_cooling', 'coil_heating'];

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
    }, {
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
    }, {
      name: 'coil_cooling_type',
      displayName: 'Type',
      field: 'coil_cooling.type'
    }, {
      name: 'coil_cooling_fuel_source',
      displayName: 'Fuel Source',
      field: 'coil_cooling.fuel_source'
    }, {
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
    }, {
      name: 'coil_heating_type',
      displayName: 'Type',
      field: 'coil_heating.type'
    }, {
      name: 'coil_cooling_fluid_segment_in_reference',
      displayName: 'Fluid Segment In',
      field: 'coil_heating.fluid_segment_in_reference'
    }, {
      name: 'coil_cooling_fluid_segment_out_reference',
      displayName: 'Fluid Segment Out',
      field: 'coil_heating.fluid_segment_out_reference'
    }];

    // TODO: add other systems
    $scope.gridOptions = {
      ptacs: {}
    };
    $scope.systemTabs.ptacs.forEach(function (tab) {
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

    // TODO: this may cause problems when having multiple panels open, revise!
    function initTabs() {
      tabClasses = {};
      tabClasses.ptacs = {
        general: 'default',
        fan: 'default',
        coil_cooling: 'default',
        coil_heating: 'default'
      };
    }

    $scope.getTabClass = function (panelName, tabName) {
      return "btn btn-" + tabClasses[panelName][tabName];
    };

    $scope.setActiveTab = function (panelName, tabName) {
      initTabs();
      tabClasses[panelName][tabName] = "primary";
    };

    $scope.isActiveTab = function (panelName, tabName) {
      if (tabClasses[panelName][tabName] === 'primary') {
        return true;
      } else {
        return false;
      }
    };

    $scope.hasSystems = function (panelName) {
      return ($scope.systems[panelName].length > 0);
    };

    $scope.hasPlant = function(panelName) {
      return ($scope.plants[panelName].length > 0);
    };

    $scope.noSystems = function () {
      count = 0;
      for (var type in $scope.systems) {
        count = count + $scope.systems[type].length;
      }
      return count;
    }

    // Initialize active tabs
    // TODO: need this?
    initTabs();
    $scope.setActiveTab('ptacs', 'general');


    // add functions
    // TODO: add other systems
    $scope.addSystem = function (name) {
      switch (name) {
        case 'ptacs':
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
          break;
        case 'vavs':
          $scope.systems.vavs.push({
            name: 'VAV' + ($scope.systems.vavs.length +1)
          });
      }
    };

    $scope.duplicateSystem = function (name) {
      new_item = angular.copy($scope.selected);
      delete new_item.$$hashKey;
      new_item.name = new_item.name + " duplicate";
      $scope.systems[name].push(new_item);
    };

    $scope.deleteSystem = function (name) {
      var index = $scope.systems[name].indexOf($scope.selected);
      $scope.systems[name].splice(index, 1);
      if (index > 0) {
        $scope.gridApi.selection.toggleRowSelection($scope.systems[name][index - 1]);
      } else {
        $scope.selected = null;
      }
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
        angular.forEach(response.data.errors, function (errors, field) {
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

      System.createUpdate({
        building_id: Shared.getBuildingId()
      }, systems, success, failure);

    };

    // Modal Settings
    $scope.openSystemCreatorModal = function () {
      var modalInstance = $modal.open({
        backdrop: 'static',
        controller: 'ModalSystemCreatorCtrl',
        templateUrl: 'systems/systemCreator.html',
        windowClass: 'wide-modal'
      });

      modalInstance.result.then(function (system) {
        for (var i = 0; i < system.quantity; ++i) {
          // explicitly set type and subtype if needed here.
          if (system.type.indexOf("vav_") > -1 ) {
            sys_type = 'vavs';
            subtype = system.type.split('_')[1];
          }
          else if (system.type.indexOf("pvav_") > -1) {
             sys_type = 'pvavs';
            subtype = system.type.split('_')[1];
          }
          else {
            sys_type = system.type;
            subtype = '';
          }
          console.log("SYSTEM TYPE: ", sys_type);

          $scope.addSystem(sys_type);
        }
      }, function () {
        // Modal canceled
      });
    };

  }]);

cbecc.controller('ModalSystemCreatorCtrl', [
  '$scope', '$modalInstance', function ($scope, $modalInstance) {
    $scope.quantity = 1;
    $scope.type = '';

    $scope.systemTypes = [
      {id: 'ptacs', name: 'PTAC: Packaged Terminal Air Conditioner '},
      {id: 'fpfcs', name: 'FPFC: Four-Pipe Fan Coil'},
      {id: 'vavs', name: 'VAV: Packaged Variable Air Volume'},
      {id: 'vav_crah', name: 'VAV-CRAH: Computer Room Air Handler'},
      {id: 'vav_crac', name: 'VAV-CRAC: Computer Room Air Conditioner'},
      {id: 'vav_psz', name: 'VAV-PSZ: Packaged Single Zone'},
      {id: 'pvavs', name: 'PVAV: Packaged Variable Air Volume'},
      {id: 'pvav_crah', name: 'PVAV-CRAH: Computer Room Air Handler'},
      {id: 'pvav_crac',  name: 'PVAV-CRAC: Computer Room Air Conditioner'},
      {id: 'pvav_psz', name: 'PVAV-PSZ: Packaged Single Zone'}
    ];

    $scope.systemDescriptions = {
      ptacs: '',
      fpfcs: '',
      vavs: 'Variable volume system: packaged variable volume DX unit with gas heating and with hot water reheat terminal units. The plants required for this system are created with the system.',
      vav_crah: '',
      vav_crac: '',
      vav_psz: '',
      pvavs: '',
      pvav_crah: '',
      pvav_crac: '',
      pvav_psz: ''
    };


    $scope.add = function () {
      var data = {};
      data.quantity = $scope.quantity;
      data.type = $scope.type;
      console.log(data);
      $modalInstance.close(data);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);


