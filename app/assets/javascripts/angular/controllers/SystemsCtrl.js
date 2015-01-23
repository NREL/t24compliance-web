cbecc.controller('SystemsCtrl', ['$scope', '$modal', 'toaster', 'uiGridConstants', 'data', 'Shared', 'Enums', 'saved_systems', 'saved_plants', function ($scope, $modal, toaster, uiGridConstants, data, Shared, Enums, saved_systems, saved_plants) {

  // put all systems DATA in array for panels (even exhaust)
  $scope.systems = {
    ptac: [],
    fpfc: [],
    szac: [],
    pvav: [],
    vav: [],
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
  $scope.systemTabs = {
    ptac: ['general', 'fan', 'coil_cooling', 'coil_heating'],
    fpfc: ['general', 'fan', 'coil_cooling', 'coil_heating'],
    szac: ['general', 'fan', 'coil_cooling', 'coil_heating'],
    pvav: ['general', 'fan', 'coil_cooling', 'coil_heating'],
    vav: ['general', 'fan', 'coil_cooling', 'coil_heating']
  };

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
    name: 'ptac',
    open: true
  }, {
    title: 'FPFC Zone Systems',
    name: 'fpfc',
    open: true
  }, {
    title: 'PSZ Systems',
    name: 'szac',
    open: true
  },{
    title: 'PVAV Air Systems',
    name: 'pvav',
    open: true
  }, {
    title: 'VAV Air Systems',
    name: 'vav',
    open: true
  }];

  $scope.plantPanels = [{
    title: 'Service Hot Water',
    name: 'shw',
    open: true
  }, {
    title: 'Hot Water Plant',
    name: 'hot_water',
    open: true
  }, {
    title: 'Chilled Water Plant',
    name: 'chilled_water',
    open: true
  }, {
    title: 'Condenser Plant',
    name: 'condenser',
    open: true
  }];


  // initalize for grid
  $scope.selected = {
    ptac: null,
    fpfc: null,
    szac: null,
    pvav: null,
    vav: null
  };

  $scope.gridApi = {
    ptac: null,
    fpfc: null,
    szac: null,
    pvav: null,
    vav: null
  };

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
    displayName: 'Pump Head',
    secondLine: Shared.html('ft H<sub>2</sub>O'),
    field: 'boilers[0].pump.total_head',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
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
    secondLine: Shared.html('hp'),
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
    name: 'name',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'temperature_control',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.fluid_systems_temperature_control_enums,
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'reset_supply_high',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'reset_supply_low',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'reset_outdoor_high',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'reset_outdoor_low',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }];
  $scope.gridPlantCols.chilled_water.chiller = [{
    name: 'chiller_name',
    displayName: 'Name',
    field: 'chillers[0].name',
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }, {
    name: 'chiller_type',
    displayName: 'Type',
    field: 'chillers[0].type',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.chillers_type_enums,
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }, {
    name: 'chiller_condenser_type',
    displayName: 'Condenser Type',
    field: 'chillers[0].condenser_type',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.chillers_condenser_type_enums,
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'

  }, {
    name: 'capacity_rated',
    field: 'chillers[0].capacity_rated',
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'

  }, {
    name: 'kw_per_ton',
    displayName: 'kW per ton',
    field: 'chillers[0].kw_per_ton',
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'

  }, {
    name: 'iplv_kw_per_ton',
    displayName: 'IPLV per ton',
    field: 'chillers[0].iplv_kw_per_ton',
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'

  }];
  $scope.gridPlantCols.chilled_water.pump = [{
    name: "pump_name",
    field: 'chillers[0].pump.name',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'pump_operation_control',
    displayName: 'Operation',
    field: 'chillers[0].pump.operation_control',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.pumps_operation_control_enums,
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'pump_speed_control',
    displayName: 'Speed Control',
    field: 'chillers[0].pump.speed_control',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.pumps_speed_control_enums,
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'pump_flow_capacity',
    displayName: 'Design Flow Rate',
    field: 'chillers[0].pump.flow_capacity',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'pump_total_head',
    displayName: 'Pump Head',
    secondLine: Shared.html('ft H<sub>2</sub>O'),
    field: 'chillers[0].pump.total_head',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'pump_motor_efficiency',
    displayName: 'Motor Efficiency',
    field: 'chillers[0].pump.motor_efficiency',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'pump_impeller_efficiency',
    displayName: 'Impeller Efficiency',
    field: 'chillers[0].pump.impeller_efficiency',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'pump_motor_hp',
    displayName: 'Motor HP',
    secondLine: Shared.html('hp'),
    field: 'chillers[0].pump.motor_HP',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }];
  $scope.gridPlantCols.chilled_water.coil_cooling = angular.copy($scope.gridPlantCols.hot_water.coil_heating);

  $scope.gridPlantCols.condenser.heat_rejection = [{
    name: "heat_rejection_name",
    displayName: 'Name',
    field: 'heat_rejections[0].name',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: "heat_rejection_type",
    displayName: 'Type',
    field: 'heat_rejections[0].type',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.heat_rejections_type_enums,
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: "heat_rejection_modulation_control",
    displayName: 'Modulation Control',
    field: 'heat_rejections[0].modulation_control',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.heat_rejections_modulation_control_enums,
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: "heat_rejection_capacity_rated",
    displayName: 'Capacity Rated',
    field: 'heat_rejections[0].capacity_rated',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: "heat_rejection_total_fan_hp",
    displayName: 'Total Fan HP',
    secondLine: Shared.html('hp'),
    field: 'heat_rejections[0].total_fan_hp',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: "heat_rejection_fan_type",
    displayName: 'Fan Type',
    field: 'heat_rejections[0].fan_type',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.heat_rejections_fan_type_enums,
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }];
  $scope.gridPlantCols.condenser.pump = [{
    name: "pump_name",
    field: 'heat_rejections[0].pump.name',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'pump_operation_control',
    displayName: 'Operation',
    field: 'heat_rejections[0].pump.operation_control',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.pumps_operation_control_enums,
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'pump_speed_control',
    displayName: 'Speed Control',
    field: 'heat_rejections[0].pump.speed_control',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.pumps_speed_control_enums,
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'pump_flow_capacity',
    displayName: 'Design Flow Rate',
    field: 'heat_rejections[0].pump.flow_capacity',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'pump_total_head',
    displayName: 'Pump Head',
    secondLine: Shared.html('ft<sup>2</sup> H<sub>2</sub>O'),
    field: 'heat_rejections[0].pump.total_head',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'pump_motor_efficiency',
    displayName: 'Motor Efficiency',
    field: 'heat_rejections[0].pump.motor_efficiency',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'pump_impeller_efficiency',
    displayName: 'Impeller Efficiency',
    field: 'heat_rejections[0].pump.impeller_efficiency',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'pump_motor_hp',
    displayName: 'Motor HP',
    secondLine: Shared.html('hp'),
    field: 'heat_rejections[0].pump.motor_HP',
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }];

  $scope.gridCols = {
    ptac: {},
    fpfc: {},
    szac: {},
    vav: {},
    pvav: {}
  };

  min_width = 150;

  $scope.gridCols.ptac.general = [{
    name: 'name',
    displayName: 'System Name',
    enableHiding: false,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }];
  $scope.gridCols.ptac.fan = [{
    name: 'name',
    displayName: 'System Name',
    enableHiding: false,
    minWidth: min_width,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'fan_name',
    displayName: 'Fan Name',
    field: 'fan.name',
    enableHiding: false,
    minWidth: min_width,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'fan_classification',
    displayName: 'Classification',
    field: 'fan.classification',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.fans_classification_enums,
    enableHiding: false,
    minWidth: min_width,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'fan_centrifugal_type',
    displayName: 'Centrifugal Type',
    field: 'fan.centrifugal_type',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.fans_centrifugal_type_enums,
    enableHiding: false,
    minWidth: min_width,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'fan_modeling_method',
    displayName: 'Modeling Method',
    field: 'fan.modeling_method',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.fans_modeling_method_enums,
    enableHiding: false,
    minWidth: min_width,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'fan_flow_efficiency',
    displayName: 'Flow Efficiency',
    field: 'fan.flow_efficiency',
    enableHiding: false,
    minWidth: min_width,
    filter: Shared.numberFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'fan_total_static_pressure',
    displayName: 'Total Static Pressure',
    field: 'fan.total_static_pressure',
    enableHiding: false,
    minWidth: min_width + 20,
    filter: Shared.numberFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'fan_motor_bhp',
    displayName: 'Motor BHP',
    secondLine: Shared.html('hp'),
    field: 'fan.motor_bhp',
    enableHiding: false,
    minWidth: min_width,
    filter: Shared.numberFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'fan_motor_position',
    displayName: 'Motor Position',
    field: 'fan.motor_position',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.fans_motor_position_enums,
    enableHiding: false,
    minWidth: min_width,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'fan_motor_hp',
    displayName: 'Motor HP',
    secondLine: Shared.html('hp'),
    field: 'fan.motor_hp',
    enableHiding: false,
    minWidth: min_width,
    filter: Shared.numberFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'fan_motor_type',
    displayName: 'Motor Type',
    field: 'fan.motor_type',
    minWidth: min_width,
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.fans_motor_type_enums,
    enableHiding: false,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'fan_motor_pole_count',
    displayName: 'Motor Pole Count',
    field: 'fan.motor_pole_count',
    enableHiding: false,
    minWidth: min_width,
    filter: Shared.numberFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }, {
    name: 'fan_motor_efficiency',
    displayName: 'Motor Efficiency',
    field: 'fan.motor_efficiency',
    enableHiding: false,
    minWidth: min_width,
    filter: Shared.numberFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCellWithUnits'
  }];
  $scope.gridCols.ptac.coil_cooling = [{
    name: 'name',
    displayName: 'System Name'
  }, {
    name: 'coil_cooling_name',
    displayName: 'Coil Name',
    field: 'coil_cooling.name',
    enableHiding: false,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }];
  $scope.gridCols.ptac.coil_heating = [{
    name: 'name',
    displayName: 'System Name',
    enableHiding: false,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'

  }, {
    name: 'coil_heating_name',
    displayName: 'Coil Name',
    field: 'coil_heating.name',
    enableHiding: false,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }];
  $scope.gridCols.fpfc.general = [{
    name: 'name',
    displayName: 'System Name',
    enableHiding: false,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }];
  $scope.gridCols.fpfc.general = angular.copy($scope.gridCols.ptac.general);
  $scope.gridCols.fpfc.coil_heating = angular.copy($scope.gridCols.ptac.coil_heating);
  $scope.gridCols.fpfc.coil_cooling = angular.copy($scope.gridCols.ptac.coil_cooling);
  $scope.gridCols.fpfc.fan = angular.copy($scope.gridCols.ptac.fan);
  $scope.gridCols.szac.general = [{
    name: 'name',
    displayName: 'System Name',
    enableHiding: false,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }, {
    name: 'sub_type',
    displayName: 'Sub-Type',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.air_systems_sub_type_enums,
    enableHiding: false,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }];
  $scope.gridCols.szac.fan = angular.copy($scope.gridCols.ptac.fan);
  $scope.gridCols.szac.coil_cooling = [{
    name: 'name',
    displayName: 'System Name',
    enableHiding: false,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }, {
    name: 'coil_cooling_name',
    displayName: 'Coil Name',
    field: 'coil_cooling.name',
    enableHiding: false,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }, {
    name: 'coil_cooling_dxeer',
    displayName: 'DXEER',
    field: 'coil_cooling.dxeer',
    enableHiding: false,
    filter: Shared.numberFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }];
  $scope.gridCols.szac.coil_heating = [{
    name: 'name',
    displayName: 'System Name',
    enableHiding: false,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }, {
    name: 'coil_heating_name',
    displayName: 'Coil Name',
    field: 'coil_heating.name',
    enableHiding: false,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }, {
    name: 'coil_heating_furnace_afue',
    displayName: 'Furnace AFUE',
    field: 'coil_heating.furnace_afue',
    enableHiding: false,
    filter: Shared.numberFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }];
  $scope.gridCols.pvav.general = [{
    name: 'name',
    displayName: 'System Name',
    enableHiding: false,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }, {
    name: 'reheat_control_method',
    displayName: 'Reheat Control',
    enableHiding: false,
    filter: Shared.textFilter(),
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.air_systems_reheat_control_method_enums,
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }, {
    name: 'cooling_control',
    displayName: 'Cooling Control',
    enableHiding: false,
    filter: Shared.textFilter(),
    editableCellTemplate: 'ui-grid/dropdownEditor',
    editDropdownOptionsArray: Enums.enumsArr.air_systems_cooling_control_enums,
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
/*   }, {
    name: 'cool_reset_supply_high',
    displayName: 'Cool Reset Supply High',
    enableHiding: false,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'
  }, {
    name: 'cool_reset_supply_low',
    displayName: 'Cool Reset Supply Low',
    enableHiding: false,
    filter: Shared.textFilter(),
    headerCellTemplate: 'ui-grid/cbeccHeaderCell'  */
  }];
  $scope.gridCols.pvav.fan = angular.copy($scope.gridCols.ptac.fan);
  $scope.gridCols.pvav.coil_heating = angular.copy($scope.gridCols.ptac.coil_heating);
  $scope.gridCols.pvav.coil_cooling = angular.copy($scope.gridCols.szac.coil_cooling);
  $scope.gridCols.vav.general = angular.copy($scope.gridCols.pvav.general);
  $scope.gridCols.vav.fan = angular.copy($scope.gridCols.fpfc.fan);
  $scope.gridCols.vav.coil_heating = angular.copy($scope.gridCols.fpfc.coil_heating);
  $scope.gridCols.vav.coil_cooling = angular.copy($scope.gridCols.fpfc.coil_cooling);

  //**** CREATE GRIDS ****
  // System Grids
  $scope.gridOptions = {
    ptac: {},
    fpfc: {},
    szac: {},
    pvav: {},
    vav: {}
  };
  $scope.gridSystemApi = {
    ptac: {},
    fpfc: {},
    szac: {},
    pvav: {},
    vav: {}
  };

  _.each($scope.systemTabs, function (tabs, type) {
    if (type == 'ptac' || type == 'fpfc' || type == 'szac' || type == 'pvav' || type == 'vav') {
      _.each(tabs, function (tab) {
        $scope.gridOptions[type][tab] = {
          columnDefs: $scope.gridCols[type][tab],
          enableCellEditOnFocus: true,
           enableRowHeaderSelection: true,
          enableRowSelection: true,
          enableSorting: true,
          enableFiltering: true,
          multiSelect: false,
          data: $scope.systems[type],
          onRegisterApi: function (gridApi) {
             $scope.gridSystemApi[type] = gridApi;
             gridApi.selection.on.rowSelectionChanged($scope, function (row) {
             if (row.isSelected) {
             $scope.selected[type] = row.entity;
             } else {
             // No rows selected
             $scope.selected[type] = null;
             }
             });

            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
              if ((colDef.name == 'name' || colDef.name == 'coil_heating_name' || colDef.name == 'coil_cooling_name') && newValue != oldValue) {
                // update connected coils
                $scope.display_coils_heating = calculateCoilsHeating();
                $scope.display_coils_cooling = calculateCoilsCooling();
              }
            });
          }
        };
      });
    }
  });

  // coil totals for plants
  $scope.display_coils_heating = calculateCoilsHeating();
  $scope.display_coils_cooling = calculateCoilsCooling();

  // Plant Grids
  $scope.gridPlantOptions = {
    hot_water: {},
    chilled_water: {},
    shw: {},
    condenser: {}
  };

  $scope.gridPlantApi = {
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
          enableRowHeaderSelection: false,
          enableRowSelection: false,
          enableColumnMenus: false,
          onRegisterApi: function (gridApi) {
            $scope.gridPlantApi[type][tab] = gridApi;
          }
        };
        if (tab == 'coil_heating') {
          $scope.gridPlantOptions[type][tab].data = 'display_coils_heating';
        }
        else if (tab == 'coil_cooling') {
          $scope.gridPlantOptions[type][tab].data = 'display_coils_cooling';
         }
        else {
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
      case 'szac':
        $scope.tabClasses.szac = {
          general: 'default',
          fan: 'default',
          coil_cooling: 'default',
          coil_heating: 'default'
        };
        break;
      case 'pvav':
        $scope.tabClasses.pvav = {
          general: 'default',
          fan: 'default',
          coil_cooling: 'default',
          coil_heating: 'default'
        };
        break;
      case 'vav':
        $scope.tabClasses.vav = {
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
  $scope.setActiveTab('szac', 'general');
  $scope.setActiveTab('pvav', 'general');
  $scope.setActiveTab('vav', 'general');
  $scope.setActiveTab('hot_water', 'pump');
  $scope.setActiveTab('chilled_water', 'general');
  $scope.setActiveTab('condenser', 'pump');

  //**** ADD ****
  // add functions
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
            name: "PTAC " + index + " Fan",
            control_method: 'ConstantVolume'
          },
          coil_cooling: {
            name: "PTAC " + index + " Cooling Coil",
            type: "DirectExpansion",
            condenser_type: "Air"
          },
          coil_heating: {
            name: "PTAC " + index + " Heating Coil",
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
            name: "FPFC " + index + " Fan",
            control_method: 'ConstantVolume'
          },
          coil_cooling: {
            name: "FPFC " + index + " Cooling Coil",
            type: "ChilledWater"
          },
          coil_heating: {
            name: "FPFC " + index + " Heating Coil",
            type: "HotWater"
          }
        });
        break;
      case 'szac':
        index = $scope.systems.szac.length + 1;
        $scope.systems.szac.push({
          name: "PSZ" + index,
          type: 'SZAC',
          sub_type: 'SinglePackage',
          fan: {
            name: "PSZ" + index + " Fan",
            control_method: 'ConstantVolume'
          },
          coil_cooling: {
            name: "PSZ" + index + "Cooling Coil",
            type: "DirectExpansion"

          },
          coil_heating: {
            name: "PSZ" + index + " Heating Coil",
            type: "Furnace",
            fuel_source: "NaturalGas"
          }
        });
        break;
      case 'pvav':
        index = $scope.systems.pvav.length + 1;
        $scope.systems.pvav.push({
          name: "PVAV" + index,
          type: 'PVAV',
          cooling_control: 'WarmestResetFlowFirst',
          fan: {
            name: "PVAV " + index + " Fan",
            control_method: 'VariableSpeedDrive'
          },
          coil_cooling: {
            name: "PVAV " + index + " Cooling Coil",
            type: "DirectExpansion",
            fuel_source: 'Electric',
            number_cooling_stages: 2
          },
          coil_heating: {
            name: "PVAV " + index + " Heating Coil",
            type: "HotWater"
          }
        });
        break;
      case 'vav':
        index = $scope.systems.vav.length + 1;
        $scope.systems.vav.push({
          name: 'VAV' + index,
          type: 'VAV',
          fan: {
            name: "VAV " + index + " Fan",
            control_method: 'VariableSpeedDrive'
          },
          coil_cooling: {
            name: "VAV " + index + " Cooling Coil",
            type: "ChilledWater"
          },
          coil_heating: {
            name: "VAV " + index + " Heating Coil",
            type: "HotWater"
          }
        });
        break;
    }
    addDependentPlants(name);
    $scope.display_coils_heating = calculateCoilsHeating();
    $scope.display_coils_cooling = calculateCoilsCooling();
  };

  // this doesn't seem to be working from addSystem function
  function calculateCoilsHeating() {
    var hcoils = [];
    if ($scope.plants.hot_water.length) {
      _.each($scope.systems, function (systems, type) {
        _.each($scope.systems[type], function (item) {
          if (item['coil_heating']['type'] === 'HotWater'){
            hcoils.push({
              name: item['coil_heating']['name'],
              system_name: item['name'],
              system_type: item['type']
            });
          }
        });
      });
    }
    return hcoils;
  }

  function calculateCoilsCooling() {
    var ccoils = [];
    if ($scope.plants.chilled_water.length) {
      _.each($scope.systems, function (systems, type) {
        _.each($scope.systems[type], function (item) {
          if (item['coil_cooling']['type'] === 'ChilledWater') {
            ccoils.push({
              name: item['coil_cooling']['name'],
              system_name: item['name'],
              system_type: item['type']
            });
          }
        });
      });
    }
    return ccoils;
  }

  function addDependentPlants(name) {
    console.log('adding dependent plants for: ', name);
    switch (name) {
      case 'ptac':
        //hot_water plant only
        addPlant('hot_water');
        break;
      case 'fpfc':
        //hot and chilled water (& condenser)
        addPlant('hot_water');
        addPlant('chilled_water');
        addPlant('condenser');
        break;
      case 'szac':
        //nothing to add
        break;
      case 'pvav':
        //hot_water plant only
        addPlant('hot_water');
        break;
      case 'vav':
        //hot and chilled water (& condenser)
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


  $scope.duplicateSystem = function (name) {
    var new_item = angular.copy($scope.selected[name]);
    console.log("name:");
    console.log(name);
    console.log($scope.selected);
    delete new_item.$$hashKey;
    new_item.name += " duplicate";
    $scope.systems[name].push(new_item);
    // recalculate coils
    $scope.display_coils_heating = calculateCoilsHeating();
    $scope.display_coils_cooling = calculateCoilsCooling();
  };

  $scope.deleteSystem = function (name) {
    var index = $scope.systems[name].indexOf($scope.selected[name]);
    $scope.systems[name].splice(index, 1);
    if (index > 0) {
      $scope.gridApi[name].selection.toggleRowSelection($scope.systems[name][index - 1]);
    } else {
      $scope.selected[name] = null;
    }
    //recalculate coils
    $scope.display_coils_heating = calculateCoilsHeating();
    $scope.display_coils_cooling = calculateCoilsCooling();

    // TODO: remove plants if necessary
  };

  //**** SAVE ****
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

  $scope.expandAll = function () {
    _.each(['systemPanels', 'plantPanels'], function (panelType) {
      _.each($scope[panelType], function (panel) {
        panel.open = true;
      });
    });
  };
  $scope.collapseAll = function () {
    _.each(['systemPanels', 'plantPanels'], function (panelType) {
      _.each($scope[panelType], function (panel) {
        panel.open = false;
      });
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
      id: 'szac',
      name: 'PSZ: Packaged Single Zone Air Conditioner'
    }, {
      id: 'vav',
      name: 'VAV: Variable Air Volume'
    }, {
      id: 'pvav',
      name: 'PVAV: Packaged Variable Air Volume'
    }];

    $scope.systemDescriptions = {
      ptac: 'Packaged terminal air conditioner: Ductless single-zone DX unit with hot water natural gas boiler.',
      fpfc: 'Four-pipe fan coil: Ductless single-zone unit with hot water and chilled water coils.',
      szac: 'Packaged single zone: This system can only serve one zone and includes a DX cooling coil and a gas heating coil.',
      vav: 'Variable volume system: packaged variable volume DX unit with gas heating and with hot water reheat terminal units.',
      pvav: 'Packaged variable volume system: VAV reheat system with packaged VAV DX unit with bass heating and hot water reheat terminal units.'
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
