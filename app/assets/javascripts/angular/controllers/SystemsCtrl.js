cbecc.controller('SystemsCtrl', ['$scope', '$modal', 'toaster', 'data', 'Shared', 'Enums', 'saved_systems', 'saved_plants', function ($scope, $modal, toaster, data, Shared, Enums, saved_systems, saved_plants) {

  // put all systems DATA in array for panels
  $scope.systems = {
    ptac: [],
    fpfc: [],
    vav: [],
    pvav: [],
    exhaust: []
  };
  // same for plants
  $scope.plants = {
    shw: [],
    hot_water: [],
    chilled_water: [],
    condenser: []
  };

  // system tabs META
  // this is used to initialize the grids and render active vertical tabs in the view
  // TODO: add other tab defs
  $scope.systemTabs = {
    ptac: ['general', 'fan', 'coil_cooling', 'coil_heating'],
    fpfc: ['general', 'fan', 'coil_cooling', 'coil_heating'],
    vav: [],
    pvav: []
  };

  // TODO: add other plant tab defs
  $scope.plantTabs = {
    hot_water: ['pump', 'boiler', 'coil_heating'],
    chilled_water: ['general', 'pump', 'chiller', 'coil_cooling'],
    condenser: ['pump', 'heat_rejection'],
    shw: []
  };

  // initialize all sub-system hashes
  _.each($scope.systemTabs, function (tabs, type) {
    _.each(tabs, function (tab) {
      $scope.systems[type][tab] = [];
    });
  });
  _.each($scope.plantTabs, function (tabs, type) {
    _.each(tabs, function (tab) {
      $scope.plants[type][tab] = [];
    });
  });

  // retrieve systems and process into view format
  // process exhaust system types here too (or they will get wiped out)
  _.each(saved_systems, function (system) {
    var type = system.type.toLowerCase();
    $scope.systems[type].push(system);
  });

  _.each(saved_plants, function (plant) {
    switch (plant.type) {
      case 'HotWater':
        $scope.plants.hot_water.push(plant);
        break;
      case 'ChilledWater':
        $scope.plants.chilled_water.push(plant);
        break;
      case 'CondenserWater':
        $scope.plants.condenser.push(plant);
        break;
    }
  });

  //**** INITIALIZE ****
  //collapsible panels
  $scope.systemPanels = [{
    title: 'PTAC Zone Systems',
    name: 'ptac'
  }, {
    title: 'FPFC Zone Systems',
    name: 'fpfc'
  }, {
    title: 'VAV Air Systems',
    name: 'vav',
    open: true
  }, {
    title: 'PVAV Air Systems',
    name: 'pvav'
  }];

  $scope.plantPanels = [{
    title: 'Service Hot Water',
    name: 'shw'
  }, {
    title: 'Hot Water Plant',
    name: 'hot_water'
  }, {
    title: 'Chilled Water Plant',
    name: 'chilled_water'
  }, {
    title: 'Condenser Plant',
    name: 'condenser'
  }];

  // coil totals for plants
  $scope.display_coils_heating = calculateCoilsHeating();
  $scope.display_coils_cooling = calculateCoilsCooling();

  $scope.gridPlantCols = {
    hot_water: {},
    chilled_water: {},
    condenser: {},
    shw: {}
  };
  $scope.gridPlantCols.hot_water.boiler = [{
    name: 'boiler_name',
    displayName: 'Name',
    field: 'boilers[0].name'
  }, {
    name: 'boiler_draft_type',
    displayName: 'Draft Type',
    field: 'boilers[0].draft_type',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.boilers_draft_type_enums
  }, {
    name: 'boiler_capacity_rated',
    displayName: 'Rated Capacity',
    field: 'boilers[0].capacity_rated'
  }, {
    name: 'boiler_thermal_efficiency',
    displayName: 'Thermal Efficiency',
    field: 'boilers[0].thermal_efficiency'
  }];
  $scope.gridPlantCols.hot_water.pump = [{
    name: "pump_name",
    field: 'boilers[0].pump.name'
  }, {
    name: 'pump_operation_control',
    displayName: 'Operation',
    field: 'boilers[0].pump.operation_control',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.pumps_operation_control_enums
  }, {
    name: 'pump_speed_control',
    displayName: 'Speed Control',
    field: 'boilers[0].pump.speed_control',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.pumps_speed_control_enums
  }, {
    name: 'pump_flow_capacity',
    displayName: 'Design Flow Rate',
    field: 'boilers[0].pump.flow_capacity'
  }, {
    name: 'pump_total_head',
    displayName: 'Pump Head (ft2 H2O)',
    field: 'boilers[0].pump.total_head'
  }, {
    name: 'pump_motor_efficiency',
    displayName: 'Motor Efficiency',
    field: 'boilers[0].pump.motor_efficiency'
  }, {
    name: 'pump_impeller_efficiency',
    displayName: 'Impeller Efficiency',
    field: 'boilers[0].pump.impeller_efficiency'
  }, {
    name: 'pump_motor_hp',
    displayName: 'Motor HP',
    field: 'boilers[0].pump.motor_HP'
  }];
  $scope.gridPlantCols.hot_water.coil_heating = [{
    name: 'name'
  }, {
    name: 'system_name'
  }, {
    name: 'system_type'
  }];
  $scope.gridPlantCols.chilled_water.general = [{
    name: 'name'
  }, {
    name: 'temperature_control',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.fluid_systems_temperature_control_enums
  }, {
    name: 'reset_supply_high'
  }, {
    name: 'reset_supply_low'
  }, {
    name: 'reset_outdoor_high'
  }, {
    name: 'reset_outdoor_low'
  }];
  $scope.gridPlantCols.chilled_water.chiller = [{
    name: 'chiller_name',
    displayName: 'Name',
    field: 'chillers[0].name'
  }, {
    name: 'chiller_type',
    displayName: 'Type',
    field: 'chillers[0].type',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.chillers_type_enums
  }, {
    name: 'chiller_condenser_type',
    displayName: 'Condenser Type',
    field: 'chillers[0].condenser_type',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.chillers_condenser_type_enums
  }, {
    name: 'capacity_rated',
    field: 'chillers[0].capacity_rated'
  }, {
    name: 'kw_per_ton',
    displayName: 'kW per ton',
    field: 'chillers[0].kw_per_ton'
  }, {
    name: 'iplv_kw_per_ton',
    displayName: 'IPLV per ton',
    field: 'chillers[0].iplv_kw_per_ton'
  }];
  $scope.gridPlantCols.chilled_water.pump = [{
    name: "pump_name",
    field: 'chillers[0].pump.name'
  }, {
    name: 'pump_operation_control',
    displayName: 'Operation',
    field: 'chillers[0].pump.operation_control',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.pumps_operation_control_enums
  }, {
    name: 'pump_speed_control',
    displayName: 'Speed Control',
    field: 'chillers[0].pump.speed_control',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.pumps_speed_control_enums
  }, {
    name: 'pump_flow_capacity',
    displayName: 'Design Flow Rate',
    field: 'chillers[0].pump.flow_capacity'
  }, {
    name: 'pump_total_head',
    displayName: 'Pump Head (ft2 H2O)',
    field: 'chillers[0].pump.total_head'
  }, {
    name: 'pump_motor_efficiency',
    displayName: 'Motor Efficiency',
    field: 'chillers[0].pump.motor_efficiency'
  }, {
    name: 'pump_impeller_efficiency',
    displayName: 'Impeller Efficiency',
    field: 'chillers[0].pump.impeller_efficiency'
  }, {
    name: 'pump_motor_hp',
    displayName: 'Motor HP',
    field: 'chillers[0].pump.motor_HP'
  }];
  $scope.gridPlantCols.chilled_water.coil_cooling = angular.copy($scope.gridPlantCols.hot_water.coil_heating);

  $scope.gridPlantCols.condenser.heat_rejection = [{
    name: "heat_rejection_name",
    displayName: 'Name',
    field: 'heat_rejections[0].name'
  }, {
    name: "heat_rejection_type",
    displayName: 'Type',
    field: 'heat_rejections[0].type',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.heat_rejections_type_enums
  }, {
    name: "heat_rejection_modulation_control",
    displayName: 'Modulation Control',
    field: 'heat_rejections[0].modulation_control',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.heat_rejections_modulation_control_enums
  }, {
    name: "heat_rejection_capacity_rated",
    displayName: 'Capacity Rated',
    field: 'heat_rejections[0].capacity_rated'
  }, {
    name: "heat_rejection_total_fan_hp",
    displayName: 'Total Fan HP',
    field: 'heat_rejections[0].total_fan_hp'
  }, {
    name: "heat_rejection_fan_type",
    displayName: 'Fan Type',
    field: 'heat_rejections[0].fan_type',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.heat_rejections_fan_type_enums
  }];
  $scope.gridPlantCols.condenser.pump = [{
    name: "pump_name",
    field: 'heat_rejections[0].pump.name'
  }, {
    name: 'pump_operation_control',
    displayName: 'Operation',
    field: 'heat_rejections[0].pump.operation_control',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.pumps_operation_control_enums
  }, {
    name: 'pump_speed_control',
    displayName: 'Speed Control',
    field: 'heat_rejections[0].pump.speed_control',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.pumps_speed_control_enums
  }, {
    name: 'pump_flow_capacity',
    displayName: 'Design Flow Rate',
    field: 'heat_rejections[0].pump.flow_capacity'
  }, {
    name: 'pump_total_head',
    displayName: 'Pump Head (ft2 H2O)',
    field: 'heat_rejections[0].pump.total_head'
  }, {
    name: 'pump_motor_efficiency',
    displayName: 'Motor Efficiency',
    field: 'heat_rejections[0].pump.motor_efficiency'
  }, {
    name: 'pump_impeller_efficiency',
    displayName: 'Impeller Efficiency',
    field: 'heat_rejections[0].pump.impeller_efficiency'
  }, {
    name: 'pump_motor_hp',
    displayName: 'Motor HP',
    field: 'heat_rejections[0].pump.motor_HP'
  }];

  //TODO: get systems by type
  $scope.gridCols = {
    ptac: {},
    fpfc: {},
    vav: {},
    pvav: {}
  };

  $scope.gridCols.ptac.general = [{
    name: 'name',
    displayName: 'System Name'
  }];
  $scope.gridCols.ptac.fan = [{
    name: 'name',
    displayName: 'System Name'
  }, {
    name: 'fan_name',
    displayName: 'Fan Name',
    field: 'fan.name'
  }, {
    name: 'fan_classification',
    displayName: 'Classification',
    field: 'fan.classification',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.fans_classification_enums
  }, {
    name: 'fan_centrifugal_type',
    displayName: 'Centrifugal Type',
    field: 'fan.centrifugal_type',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.fans_centrifugal_type_enums
  }, {
    name: 'fan_modeling_method',
    displayName: 'Modeling Method',
    field: 'fan.modeling_method',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.fans_modeling_method_enums
  }, {
    name: 'fan_flow_efficiency',
    displayName: 'Flow Efficiency',
    field: 'fan.flow_efficiency'
  }, {
    name: 'fan_total_static_pressure',
    displayName: 'Total Static Pressure',
    field: 'fan.total_static_pressure'
  }, {
    name: 'fan_motor_bhp',
    displayName: 'Motor BHP',
    field: 'fan.motor_bhp'
  }, {
    name: 'fan_motor_position',
    displayName: 'Motor Position',
    field: 'fan.motor_position',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.fans_motor_position_enums
  }, {
    name: 'fan_motor_hp',
    displayName: 'Motor HP',
    field: 'fan.motor_hp'
  }, {
    name: 'fan_motor_type',
    displayName: 'Motor Type',
    field: 'fan.motor_type',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.fans_motor_type_enums
  }, {
    name: 'fan_motor_pole_count',
    displayName: 'Motor Pole Count',
    field: 'fan.motor_pole_count'
  }, {
    name: 'fan_motor_efficiency',
    displayName: 'Motor Efficiency',
    field: 'fan.motor_efficiency'
  }];
  $scope.gridCols.ptac.coil_cooling = [{
    name: 'name',
    displayName: 'System Name'
  }, {
    name: 'coil_cooling_name',
    displayName: 'Coil Name',
    field: 'coil_cooling.name'
  }];
  $scope.gridCols.ptac.coil_heating = [{
    name: 'name',
    displayName: 'System Name'
  }, {
    name: 'coil_heating_name',
    displayName: 'Coil Name',
    field: 'coil_heating.name'
  }];
  $scope.gridCols.fpfc.general = [{
    name: 'name',
    displayName: 'System Name'
  }];
  $scope.gridCols.fpfc.general = angular.copy($scope.gridCols.ptac.general);
  $scope.gridCols.fpfc.coil_heating = angular.copy($scope.gridCols.ptac.coil_heating);
  $scope.gridCols.fpfc.coil_cooling = angular.copy($scope.gridCols.ptac.coil_cooling);
  $scope.gridCols.fpfc.fan = angular.copy($scope.gridCols.ptac.fan);

  //**** CREATE GRIDS ****
  // System Grids
  $scope.gridOptions = {
    ptac: {},
    fpfc: {},
    vav: {},
    pvav: {}
  };
  _.each($scope.systemTabs, function (tabs, type) {
    if (type == 'ptac' || type == 'fpfc') {
      _.each(tabs, function (tab) {
        $scope.gridOptions[type][tab] = {
          columnDefs: $scope.gridCols[type][tab],
          enableCellEditOnFocus: true,
          enableColumnMenus: false,
          enableRowHeaderSelection: true,
          enableRowSelection: true,
          enableSorting: false,
          multiSelect: false,
          data: $scope.systems[type],
          onRegisterApi: function (gridApi) {
            //This will keep overwriting gridApi
            /*$scope.gridApi = gridApi;
             gridApi.selection.on.rowSelectionChanged($scope, function (row) {
             if (row.isSelected) {
             $scope.selected = row.entity;
             } else {
             // No rows selected
             $scope.selected = null;
             }
             });*/
          }
        };
      });
    }
  });

  // Plant Grids
  $scope.gridPlantOptions = {
    hot_water: {},
    chilled_water: {},
    shw: {},
    condenser: {}
  };
  _.each($scope.plantTabs, function (tabs, type) {
    if (type == 'hot_water' || type == 'chilled_water' || type == 'condenser') {
      _.each(tabs, function (tab) {
        var editVal = true;
        if (tab == 'coil_heating' || tab == 'coil_cooling') {
          editVal = false;
        }
        $scope.gridPlantOptions[type][tab] = {
          columnDefs: $scope.gridPlantCols[type][tab],
          enableCellEditOnFocus: editVal,
          enableColumnMenus: false,
          enableRowHeaderSelection: editVal,
          enableRowSelection: editVal,
          enableSorting: true,
          multiSelect: false,
          onRegisterApi: function (gridApi) {
            //Revise
            /*$scope.gridApi = gridApi;
             gridApi.selection.on.rowSelectionChanged($scope, function (row) {
             if (row.isSelected) {
             $scope.selected = row.entity;
             } else {
             // No rows selected
             $scope.selected = null;
             }
             });*/
          }
        };
        if (tab == 'coil_heating') {
          $scope.gridPlantOptions[type].coil_heating.data = $scope.display_coils_heating;
          //console.log('gridPlantOptions for hot_water.coil_heating: ');
          //console.log($scope.gridPlantOptions.hot_water.coil_heating);
        } else if (tab == 'coil_cooling') {
          $scope.gridPlantOptions[type].coil_cooling.data = $scope.display_coils_cooling;
        } else {
          $scope.gridPlantOptions[type][tab].data = $scope.plants[type];
        }
      });
    }
  });

  //**** VIEW HELPERS: TABS & CLASSES ****
  $scope.tabClasses = {};
  $scope.gridClasses = {
    hot_water: {
      pump: 'plant-grid',
      boiler: 'plant-grid',
      coil_heating: 'plant-large-grid'
    },
    chilled_water: {},
    shw: {},
    condenser: {}
  };
  // TODO: add all systems /plants
  function initTabs(name) {
    switch (name) {
      case 'ptac':
        $scope.tabClasses.ptac = {
          general: 'default',
          fan: 'default',
          coil_cooling: 'default',
          coil_heating: 'default'
        };
        break;
      case 'fpfc':
        $scope.tabClasses.fpfc = {
          general: 'default',
          fan: 'default',
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
      case 'chilled_water':
        $scope.tabClasses.chilled_water = {
          general: 'default',
          pump: 'default',
          chiller: 'default',
          coil_cooling: 'default'
        };
        break;
      case 'condenser':
        $scope.tabClasses.condenser = {
          pump: 'default',
          heat_rejection: 'default'
        };
        break;
    }
  }

  // TODO: this doesn't work
  $scope.getGridClass = function (panelName, tabName) {
    return $scope.gridClasses[panelName][tabName] || "";
  };
  //TODO: end

  $scope.getTabClass = function (panelName, tabName) {
    return "btn btn-" + $scope.tabClasses[panelName][tabName];
  };

  $scope.setActiveTab = function (panelName, tabName) {
    initTabs(panelName);
    $scope.tabClasses[panelName][tabName] = "primary";
  };

  $scope.isActiveTab = function (panelName, tabName) {
    return $scope.tabClasses[panelName][tabName] == 'primary';
  };

  $scope.hasSystems = function (panelName) {
    return $scope.systems[panelName].length;
  };

  $scope.hasPlant = function (panelName) {
    return $scope.plants[panelName].length;
  };

  $scope.noSystems = function () {
    var count = 0;
    _.each($scope.systems, function (systems) {
      count += systems.length;
    });
    return count;
  };

  $scope.noPlants = function () {
    var count = 0;
    _.each($scope.plants, function (plants) {
      count += plants.length;
    });
    return count;
  };

  // Initialize active tabs
  // TODO: clean this up
  $scope.setActiveTab('ptac', 'general');
  $scope.setActiveTab('fpfc', 'general');
  $scope.setActiveTab('hot_water', 'pump');
  $scope.setActiveTab('chilled_water', 'general');
  $scope.setActiveTab('condenser', 'pump');

  //**** ADD ****
  // add functions
  // TODO: add other systems
  // NOTE:  this also adds fields that are defaulted.
  // They won't be shown to users, but will be passed to rails
  $scope.addSystem = function (name) {
    var index;
    switch (name) {
      case 'ptac':
        index = $scope.systems.ptac.length + 1;
        $scope.systems.ptac.push({
          name: "PTAC " + index,
          type: 'PTAC',
          fan: {
            name: "Fan " + index,
            control_method: 'ConstantVolume'
          },
          coil_cooling: {
            name: "Cooling Coil " + index,
            type: "DirectExpansion",
            condenser_type: "Air"
          },
          coil_heating: {
            name: "Heating Coil " + index,
            type: "HotWater"
          }
        });
        break;
      case 'fpfc':
        index = $scope.systems.fpfc.length + 1;
        $scope.systems.fpfc.push({
          name: "FPFC " + index,
          type: 'FPFC',
          fan: {
            name: "Fan " + index,
            control_method: 'ConstantVolume'
          },
          coil_cooling: {
            name: "Cooling Coil " + index,
            type: "ChilledWater"
          },
          coil_heating: {
            name: "Heating Coil " + index,
            type: "HotWater"
          }
        });
        break;
      case 'vav':
        index = $scope.systems.vav.length + 1;
        $scope.systems.vav.push({
          name: 'VAV' + index
        });
        break;
    }
    addDependentPlants(name);
    $scope.display_coils_heating = calculateCoilsHeating();
  };

  // this doesn't seem to be working from addSystem function
  function calculateCoilsHeating() {
    var coils = [];
    if ($scope.plants.hot_water.length) {
      _.each($scope.systems, function (systems, type) {
        //console.log("TYPE IS: ", type);
        var found = false;
        _.each($scope.systemTabs[type], function (value) {
          if (value == 'coil_heating') {
            found = true;
          }
        });
        if (found) {
          _.each($scope.systems[type], function (item) {
            coils.push({
              name: item.coil_heating.name,
              system_name: item.name,
              system_type: item.type
            });
          });
        }
      });
    }
    return coils;
  }

  function calculateCoilsCooling() {
    var coils = [];
    if ($scope.plants.chilled_water.length) {
      _.each($scope.systems, function (systems, type) {
        //console.log("TYPE IS: ", type);
        var found = false;
        _.each($scope.systemTabs[type], function (value) {
          if (value == 'coil_cooling') {
            found = true;
          }
        });
        if (found) {
          _.each($scope.systems[type], function (item) {
            coils.push({
              name: item.coil_cooling.name,
              system_name: item.name,
              system_type: item.type
            });
          });
        }
      });
    }
    return coils;
  }

  function addDependentPlants(name) {
    console.log('adding dependent plants for: ', name);
    switch (name) {
      case 'ptac':
        //hot_water plant only
        addPlant('hot_water');
        break;
      case 'fpfc':
        //hot and chilled water (and condenser?)
        addPlant('hot_water');
        addPlant('chilled_water');
        addPlant('condenser');
        break;
    }
  }

  // add plants (if none exist)
  function addPlant(name) {
    switch (name) {
      case 'hot_water':
        if (!$scope.plants.hot_water.length) {
          console.log('adding hot_water plant');
          $scope.plants.hot_water.push({
            name: "BaseHWSystem",
            type: "HotWater",
            fluid_segments: [{
              name: "BaseHWPrimSupSeg",
              type: "PrimarySupply"
            }, {
              name: "BaseHWPrimRetSeg",
              type: "PrimaryReturn"
            }],
            boilers: [{
              name: "Base Blr",
              type: "HotWater",
              fuel_source: "Gas",
              fluid_segment_in_reference: "BaseHWPrimRetSeg",
              fluid_segment_out_reference: "BaseHWPrimSupSeg",
              pump: {
                name: "Base HW Pump"
              }
            }]
          });
        }
        break;
      case 'chilled_water':
        if (!$scope.plants.chilled_water.length) {
          console.log('adding chilled_water plant');
          $scope.plants.chilled_water.push({
            name: "BaseChWSystem",
            type: "ChilledWater",
            temperature_control: "OutsideAirReset",
            fluid_segments: [{
              name: "BaseChWPrimSupSeg",
              type: "PrimarySupply"
            }, {
              name: "BaseChWPrimRetSeg",
              type: "PrimaryReturn"
            }],
            chillers: [{
              name: "Base Chlr",
              type: "Centrifugal",
              fuel_source: "Electric",
              condenser_type: "Air",
              evaporator_fluid_segment_in_reference: "BaseChWPrimRetSeg",
              evaporator_fluid_segment_out_reference: "BaseChWPrimSupSeg",
              pump: {
                name: "Base ChW Pump"
              }
            }]
          });
        }
        break;
      case 'condenser':
        if (!$scope.plants.condenser.length) {
          console.log('adding condenser');
          $scope.plants.condenser.push({
            name: "BaseCWSystem",
            type: "CondenserWater",
            fluid_segments: [{
              name: "BaseCWPrimSupSeg",
              type: "PrimarySupply"
            }, {
              name: "BaseCWPrimRetSeg",
              type: "PrimaryReturn"
            }],
            heat_rejections: [{
              name: "Base Tower",
              fluid_segment_in_reference: "BaseCWPrimRetSeg",
              fluid_segment_out_reference: "BaseCWPrimSupSeg",
              pump: {
                name: "Base CW Pump"
              }
            }]
          });
        }
        break;
    }
  }

  //ACS I don't know if this will work
  $scope.duplicateSystem = function (name) {
    var new_item = angular.copy($scope.selected);
    delete new_item.$$hashKey;
    new_item.name += " duplicate";
    $scope.systems[name].push(new_item);
    $scope.display_coils_heating = calculateCoilsHeating();
  };

  //ACS this definitely won't work with gridApi
  $scope.deleteSystem = function (name) {
    var index = $scope.systems[name].indexOf($scope.selected);
    $scope.systems[name].splice(index, 1);
    if (index > 0) {
      $scope.gridApi.selection.toggleRowSelection($scope.systems[name][index - 1]);
    } else {
      $scope.selected = null;
      //ACS why isn't this applied every time a row is deleted?
      $scope.display_coils_heating = calculateCoilsHeating();
    }
  };

  //**** SAVE ****
  // TODO: add other systems
  // TODO: add links back from plants into system parts (do this on rails side)
  $scope.submit = function () {
    console.log("submit");
    $scope.errors = {}; //clean up server errors

    console.log($scope.systems);
    var params;

    function success(response) {
      // now save plants
      // collapse all plant types into 1 array for saving
      var plants = [];
      _.each($scope.plants, function (plant) {
        _.each(plant, function (p) {
          plants.push(p);
        });
      });
      params = Shared.defaultParams();
      params.data = plants;
      console.log('SAVING PLANTS!');
      console.log(plants);
      data.bulkSync('fluid_systems', params).then(success).catch(failure);

      function success(response) {
        toaster.pop('success', 'Systems and Plants successfully saved');
      }

      function failure(response) {
        console.log("failure", response);
        toaster.pop('error', 'An error occurred while saving plants');
      }
    }

    function failure(response) {
      console.log("failure", response);
      toaster.pop('error', 'An error occurred while saving systems');
    }

    // collapse all system types into 1 array for saving
    var systems = [];
    _.each($scope.systems, function (system) {
      _.each(system, function (s) {
        systems.push(s);
      });
    });

    // first save systems
    console.log("SAVING SYSTEMS!");
    params = Shared.defaultParams();
    params.data = systems;
    data.bulkSync('zone_systems', params).then(success).catch(failure);

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
        var sys_type = '';
        var subtype = '';
        if (system.type.indexOf("pvav_") > -1) {
          sys_type = 'pvav';
          subtype = system.type.split('_')[1];
        } else if (system.type.indexOf("vav_") > -1) {
          sys_type = 'vav';
          subtype = system.type.split('_')[1];
        } else {
          sys_type = system.type;
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

    $scope.systemTypes = [{
      id: 'ptac',
      name: 'PTAC: Packaged Terminal Air Conditioner'
    }, {
      id: 'fpfc',
      name: 'FPFC: Four-Pipe Fan Coil'
    }, {
      id: 'vav',
      name: 'VAV: Packaged Variable Air Volume'
    }, {
      id: 'vav_crah',
      name: 'VAV-CRAH: Computer Room Air Handler'
    }, {
      id: 'vav_crac',
      name: 'VAV-CRAC: Computer Room Air Conditioner'
    }, {
      id: 'vav_psz',
      name: 'VAV-PSZ: Packaged Single Zone'
    }, {
      id: 'pvav',
      name: 'PVAV: Packaged Variable Air Volume'
    }, {
      id: 'pvav_crah',
      name: 'PVAV-CRAH: Computer Room Air Handler'
    }, {
      id: 'pvav_crac',
      name: 'PVAV-CRAC: Computer Room Air Conditioner'
    }, {
      id: 'pvav_psz',
      name: 'PVAV-PSZ: Packaged Single Zone'
    }];

    $scope.systemDescriptions = {
      ptac: 'Packaged terminal air conditioner: Ductless single-zone DX unit with hot water natural gas boiler.',
      fpfc: 'Four-pipe fan coil: Ductless single-zone unit with hot water and chilled water coils.',
      vav: 'Variable volume system: packaged variable volume DX unit with gas heating and with hot water reheat terminal units. The plants required for this system are created with the system.',
      vav_crah: '',
      vav_crac: '',
      vav_psz: '',
      pvav: 'Packaged variable volume system: VAV reheat system with packaged VAV DX unit with bass heating and hot water reheat terminal units.',
      pvav_crah: '',
      pvav_crac: '',
      pvav_psz: ''
    };


    $scope.add = function () {
      var data = {
        quantity: $scope.quantity,
        type: $scope.type
      };
      console.log(data);
      $modalInstance.close(data);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
