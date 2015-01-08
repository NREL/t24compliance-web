cbecc.controller('SystemsCtrl', [
  '$scope', '$window', '$stateParams', '$resource', '$location', '$modal', 'toaster', 'Shared', 'System', function ($scope, $window, $stateParams, $resource, $location, $modal, toaster, Shared, System) {

    //**** INITIALIZE ****
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
    $scope.systems = {ptacs: [], fpfcs: [], vavs: [], pvavs: [], maus: [], exhausts: []};
    // same for plants
    $scope.plants = {shw: [], hot_water: [], chilled_water: [], condenser: []};

    // system tabs META
    // this is used to initialize the grids and render active vertical tabs in the view
    $scope.systemTabs = {ptacs: [], fpfcs:[], vavs: [], pvavs: [], maus: [], exhausts: []};
    $scope.systemTabs.ptacs = ['general', 'fan', 'fan_motor', 'coil_cooling', 'coil_heating'];
    // TODO: add other tab defs

    $scope.plantTabs = {hot_water: [], chilled_water: [], condenser: [], shw: []};
    $scope.plantTabs.hot_water = ['pump', 'boiler', 'coil_heating'];
    //TODO: add other plant tab defs

    // coil totals for plants
    $scope.display_coils_heating = [];
    calculateCoilsHeating();

    gridPlantCols = {};
    gridPlantCols.hot_water = {};
    gridPlantCols.hot_water.pump = [{
      name: 'pump_operation_control',
      displayName: 'Operation',
      field: 'pump.operation_control'
    }, {
      name: 'pump_speed_control',
      displayName: 'Speed Control',
      field: 'pump.speed_control'
    }, {
      name: 'pump_flow_capacity',
      displayName: 'Design Flow Rate',
      field: 'pump.flow_capacity'
    }, {
      name: 'pump_motor_efficiency',
      displayName: 'Motor Efficiency',
      field: 'pump.motor_efficiency'
    }, {
      name: 'pump_impeller_efficiency',
      displayName: 'Impeller Efficiency',
      field: 'pump.impeller_efficiency'
    }, {
      name: 'pump_total_head',
      displayName: 'Pump Head (ft2 H2O)',
      field: 'pump.total_head'
    }, {
      name: 'pump_motor_hp',
      displayName: 'Motor HP',
      field: 'pump.motor_HP'
    }];
    gridPlantCols.hot_water.boiler = [{
      name: 'boiler_name',
      displayName: 'Name',
      field: 'boiler.name'
    }, {
      name: 'boiler_fuel_source',
      displayName: 'Fuel Source',
      field: 'boiler.fuel_source'
    }, {
      name: 'boiler_draft_type',
      displayName: 'Draft Type',
      field: 'boiler.draft_type'
    }, {
      name: 'boiler_capacity_rated',
      displayName: 'Rated Capacity',
      field: 'boiler.capacity_rated'
    }, {
      name: 'boiler_afue',
      displayName: 'AFUE',
      field: 'boiler.afue'
    }, {
      name: 'boiler_thermal_efficiency',
      displayName: 'Thermal Efficiency',
      field: 'boiler.thermal_efficiency'
    }];
    gridPlantCols.hot_water.coil_heating = [{
      name: 'name',
      displayName: 'Name'
      }, {
      name: 'system_name',
      displayName: 'System Name'
    }, {
      name: 'system_type',
      displayName: 'System Type'
    }];



    //TODO: get systems by type
    gridCols = {};
    gridCols.ptacs = {};
    gridCols.ptacs.general = [{
      name: 'name',
      displayName: 'System Name'
    }];
    gridCols.ptacs.fan = [{
      name: 'name',
      displayName: 'System Name'
    }, {
      name: 'fan_name',
      displayName: 'Fan Name',
      field: 'fan.name'
    }, {
      name: 'fan_flow_efficiency',
      displayName: 'Flow Efficiency',
      field: 'fan.flow_efficiency'
    }, {
      name: 'fan_total_static_pressure',
      displayName: 'Total Static Pressure',
      field: 'fan.total_static_pressure'
    }];
    gridCols.ptacs.fan_motor = [{
      name: 'fan_name',
      displayName: 'Fan Name',
      field: 'fan.name'
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
    }];
    gridCols.ptacs.coil_heating = [{
      name: 'name',
      displayName: 'System Name'
    }, {
      name: 'coil_heating_name',
      displayName: 'Coil Name',
      field: 'coil_heating.name'
    }];

    // TODO: add other systems
    $scope.gridOptions = {
      ptacs: {}
    };
    $scope.systemTabs.ptacs.forEach(function (tab) {
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

    //Plant Grids
    $scope.gridPlantOptions = {
      hot_water: {},
      chilled_water: {},
      shw: {},
      condenser: {}
    };
    $scope.plantTabs.hot_water.forEach(function (tab) {
      console.log("TAB: ", tab);
      editVal = '';
       if (tab === 'coil_heating') {
         editVal = false;
       }
      else {
         editVal = true;
       }
       $scope.gridPlantOptions.hot_water[tab] = {
         columnDefs: gridPlantCols.hot_water[tab],
         enableCellEditOnFocus: editVal,
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
      if (tab === 'coil_heating') {
        $scope.gridPlantOptions.hot_water.coil_heating.data = $scope.display_coils_heating;
      }
      else {
        $scope.gridPlantOptions.hot_water[tab].data = $scope.plants.hot_water;
      }

    });

    //**** VIEW HELPERS: TABS & CLASSES ****
    $scope.tabClasses = {};
    $scope.gridClasses = {hot_water: {pump: 'plantGrid', boiler: 'plantGrid', coil_heating: 'plantLargeGrid'}, chilled_water: {}, shw: {}, condenser: {}};
    // TODO: add all systems /plants
    function initTabs(name) {
      switch (name) {
        case 'ptacs':
          $scope.tabClasses.ptacs = {
            general: 'default',
            fan: 'default',
            fan_motor: 'default',
            coil_cooling: 'default',
            coil_heating: 'default'
          };
          break;
        case 'hot_water':
          $scope.tabClasses.hot_water = {
            pump: 'default',
            boiler: 'default',
            coil_heating: 'default'
          };
          break;
      }
    }
    //TODO: this doesn't work right...class gets overwritten
    $scope.getGridClass = function (panelName, tabName) {
      return $scope.gridClasses[panelName][tabName] || "";
    };

    $scope.getTabClass = function (panelName, tabName) {
      return "btn btn-" + $scope.tabClasses[panelName][tabName];
    };

    $scope.setActiveTab = function (panelName, tabName) {
      initTabs(panelName);
      $scope.tabClasses[panelName][tabName] = "primary";
    };

    $scope.isActiveTab = function (panelName, tabName) {
      if ($scope.tabClasses[panelName][tabName] === 'primary') {
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
    };

    $scope.noPlants = function () {
      count = 0;
      for (var type in $scope.plants) {
        count = count + $scope.plants[type].length;
      }
      return count;
    };

    // Initialize active tabs
    // TODO: clean this up
    $scope.setActiveTab('ptacs', 'general');
    $scope.setActiveTab('hot_water', 'pump');


    //**** ADD ****
    // add functions
    // TODO: add other systems
    // NOTE:  this also adds fields that are defaulted.
    // They won't be shown to users, but will be passed to rails
    $scope.addSystem = function (name) {
      switch (name) {
        case 'ptacs':
          $scope.systems.ptacs.push({
            name: "PTAC " + ($scope.systems.ptacs.length + 1),
            type: 'PTAC',
            fan: {
              name: "Fan " + ($scope.systems.ptacs.length + 1),
              control_method: 'ConstantVolume'
            },
            coil_cooling: {
              name: "Cooling Coil " + ($scope.systems.ptacs.length + 1),
              type: "DirectExpansion",
              condenser_type: "Air"
            },
            coil_heating: {
              name: "Heating Coil " + ($scope.systems.ptacs.length + 1),
              type: "HotWater"
            }
          });
          break;
        case 'vavs':
          $scope.systems.vavs.push({
            name: 'VAV' + ($scope.systems.vavs.length +1)
          });
          break;
      }

      addDependentPlants(name);
      calculateCoilsHeating();
    };

    function calculateCoilsHeating() {
      console.log('in calculateCoilsHeating');
      if ($scope.plants.hot_water.length > 0) {
        coils = [];
        for (var type in $scope.systems) {
          console.log("TYPE IS: ", type);
          found = 0;
          for (i=0; i < $scope.systemTabs[type].length; i++) {
            if ($scope.systemTabs[type][i] === 'coil_heating') {
              found = 1;
            }
          }
          if (found == 1) {
            $scope.systems[type].forEach( function (item) {
              coils.push( {
                name: item.coil_heating.name,
                system_name: item.name,
                system_type: item.type
              });
            });
          }
        }
        console.log('COILS HEATING:');
        console.log(coils);
        $scope.display_coils_heating = angular.copy(coils);
        console.log($scope.gridPlantOptions.hot_water.coil_heating.data);
      }
    }

    function addDependentPlants(name) {
      console.log('adding dependent plants for: ', name);
      switch (name) {
        case 'ptacs':
          //hot_water plant only
          addPlant('hot_water');
          break;
        case 'fpfcs':
          //hot and chilled water
          addPlant('hot_water');
          addPlant('chilled_water');
          break;
        default:
          break;
      }
    }

    // add plants (if none exist)
    function addPlant(name) {
      switch (name) {
        case 'hot_water':
          if ($scope.plants.hot_water.length == 0) {
            console.log('adding hot_water plant');
           $scope.plants.hot_water.push({
             name: "BaseHWSystem",
             type: "HotWater",
             fluid_segments: [
               {
                 name:"BaseHWPrimSupSeg",
                 type:"PrimarySupply"
               },
               {
                 name:"BaseHWPrimRetSeg",
                 type:"PrimaryReturn"
               }
             ],
             pump: {
               name: "Base HW Pump",
               operation_control: "OnDemand"
             },
             boiler: {
               name: "Base Blr"
             }
           })
          }
          break;
        default:
          break;
      }
    }

    $scope.duplicateSystem = function (name) {
      new_item = angular.copy($scope.selected);
      delete new_item.$$hashKey;
      new_item.name = new_item.name + " duplicate";
      $scope.systems[name].push(new_item);
      calculateCoilsHeating();
    };

    $scope.deleteSystem = function (name) {
      var index = $scope.systems[name].indexOf($scope.selected);
      $scope.systems[name].splice(index, 1);
      if (index > 0) {
        $scope.gridApi.selection.toggleRowSelection($scope.systems[name][index - 1]);
      } else {
        $scope.selected = null;
        calculateCoilsHeating();
      }
    };

    //**** SAVE ****
    // TODO: add other systems
    // TODO: add links back from plants into system parts (do this on rails side)
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

    //**** Modal Settings ****
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
      ptacs: 'Packaged terminal air conditioner: Ductless single-zone DX unit with hot water natural gas boiler.',
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


