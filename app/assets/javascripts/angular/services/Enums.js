cbecc.factory('Enums', function () {
  var service = {};

  /*
   * This is a placeholder file to hold all enumeration for the angular app.
   * The enum variables are prefixed with the rails model name, e.g.:
   * 'project_climate_zone_enums' refers to the climate_zone field in the project model
   */

  service.enums = {
    project_climate_zone_enums: [
      'ClimateZone1',
      'ClimateZone2',
      'ClimateZone3',
      'ClimateZone4',
      'ClimateZone5',
      'ClimateZone6',
      'ClimateZone7',
      'ClimateZone8',
      'ClimateZone9',
      'ClimateZone10',
      'ClimateZone11',
      'ClimateZone12',
      'ClimateZone13',
      'ClimateZone14',
      'ClimateZone15',
      'ClimateZone16'
    ],
    project_weather_station_enums: [
      'ALTURAS_725958',
      'ARCATA_725945',
      'BAKERSFIELD_723840',
      'BISHOP_724800',
      'BLUE-CANYON_725845',
      'BLYTHE-RIVERSIDE-CO_747188',
      'BURBANK-GLENDALE_722880',
      'CAMARILLO_723926',
      'CAMP-PENDLETON_722926',
      'CARLSBAD_722927',
      'CHINA-LAKE_746120',
      'CHINO_722899',
      'CONCORD_724936',
      'CRESCENT-CITY_725946',
      'DAGGETT-BARSTOW_723815',
      'EDWARDS-AFB_723810',
      'EL-CENTRO_722810',
      'EUREKA_725940',
      'FAIRFLD-TRAVIS-AFB_745160',
      'FRESNO_723890',
      'FULLERTON_722976',
      'HAWTHORNE-NORTHROP-FLD_722956',
      'HAYWARD_724935',
      'IMPERIAL_747185',
      'IMPERIAL-BEACH_722909',
      'INYOKERN_723826',
      'LANCASTER_723816',
      'LEMOORE_747020',
      'LIVERMORE_724927',
      'LOMPOC_722895',
      'LONG-BEACH_722970',
      'LOS-ALAMITOS_722975',
      'LOS-ANGELES-DOWNTOWN_722874',
      'LOS-ANGELES-INTL_722950',
      'MARYSVILLE-BEALE-AFB_724837',
      'MERCED_724815',
      'MODESTO_724926',
      'MOJAVE_722953',
      'MONTAGUE-SISKIYOU-CO_725955',
      'MONTEREY_724915',
      'MOUNT-SHASTA_725957',
      'NAPA-CO_724955',
      'NEEDLES_723805',
      'OAKLAND_724930',
      'OXNARD_723927',
      'PALMDALE_723820',
      'PALM-SPRINGS-INTL_722868',
      'PALM-SPRINGS-THERMAL_747187',
      'PALO-ALTO_724937',
      'PASO-ROBLES_723965',
      'POINT-MUGU_723910',
      'PORTERVILLE_723895',
      'RED-BLUFF_725910',
      'REDDING_725920',
      'RIVERSIDE_722869',
      'RIVERSIDE-MARCH-AFB_722860',
      'SACRAMENTO-EXECUTIVE_724830',
      'SACRAMENTO-METRO_724839',
      'SALINAS_724917',
      'SAN-CARLOS_724938',
      'SAN-CLEMENTE-IS_722925',
      'SANDBERG_723830',
      'SAN-DIEGO-GILLESPIE_722907',
      'SAN-DIEGO-LINDBERGH_722900',
      'SAN-DIEGO-MONTGOMER_722903',
      'SAN-DIEGO-NORTH-IS_722906',
      'SAN-FRANCISCO-INTL_724940',
      'SAN-JOSE-INTL_724945',
      'SAN-JOSE-REID_724946',
      'SAN-LUIS-CO_722897',
      'SAN-NICHOLAS-IS_722910',
      'SANTA-ANA_722977',
      'SANTA-BARBARA_723925',
      'SANTA-MARIA_723940',
      'SANTA-MONICA_722885',
      'SANTA-ROSA_724957',
      'SOUTH-LAKE-TAHOE_725847',
      'STOCKTON_724920',
      'TORRANCE_722955',
      'TRUCKEE-TAHOE_725846',
      'TWENTYNINE-PALMS_690150',
      'UKIAH_725905',
      'VANDENBERG-AFB_723930',
      'VAN-NUYS_722886',
      'VISALIA_723896',
      'YUBA-CO_724838'
    ],
    project_exceptional_condition_complete_building_enums: [
      'Yes',
      'No'
    ],
    project_exceptional_condition_exterior_lighting_enums: [
      'Yes',
      'No'
    ],
    project_exceptional_condition_no_cooling_system_enums: [
      'Yes',
      'No'
    ],
    project_exceptional_condition_rated_capacity_enums: [
      'Yes',
      'No'
    ],
    project_exceptional_condition_water_heater_enums: [
      'Yes',
      'No'
    ],
    project_exceptional_condition_narrative_enums: [
      'Yes',
      'No'
    ],
    project_compliance_type_enums: [
      'NewComplete',
      'NewEnvelope',
      'NewEnvelopeAndLighting',
      'NewEnvelopeAndPartialLighting',
      'NewMechanical',
      'NewMechanicalAndLighting',
      'NewMechanicalAndPartialLighting',
      'ExistingAddition',
      'ExistingAlteration',
      'ExistingAdditionAndAlteration'
    ],
    spaces_space_function_enums: [
      'Unoccupied-Include in Gross Floor Area',
      'Unoccupied-Exclude from Gross Floor Area',
      'Auditorium Area',
      'Auto Repair Area',
      'Bar, Cocktail Lounge and Casino Areas',
      'Beauty Salon Area',
      'Classrooms, Lecture, Training, Vocational Areas',
      'Civic Meeting Place Area',
      'Commercial and Industrial Storage Areas (conditioned or unconditioned)',
      'Commercial and Industrial Storage Areas (refrigerated)',
      'Computer Room',
      'Convention, Conference, Multipurpose and Meeting Center Areas',
      'Corridors, Restrooms, Stairs, and Support Areas',
      'Dining Area',
      'Dry Cleaning (Coin Operated)',
      'Dry Cleaning (Full Service Commercial)',
      'Electrical, Mechanical, Telephone Rooms',
      'Exercise Center, Gymnasium Areas',
      'Exhibit, Museum Areas',
      'Financial Transaction Area',
      'General Commercial and Industrial Work Areas, High Bay',
      'General Commercial and Industrial Work Areas, Low Bay',
      'General Commercial and Industrial Work Areas, Precision',
      'Grocery Sales Areas',
      'High-Rise Residential Living Spaces',
      'Hotel Function Area',
      'Hotel/Motel Guest Room',
      'Housing, Public and Common Areas: Multi-family, Dormitory',
      'Housing, Public and Common Areas: Senior Housing',
      'Kitchen, Commercial Food Preparation',
      'Kitchenette or Residential Kitchen',
      'Laboratory, Scientific',
      'Laboratory, Equipment Room',
      'Laundry',
      'Library, Reading Areas',
      'Library, Stacks',
      'Lobby, Hotel',
      'Lobby, Main Entry',
      'Locker/Dressing Room',
      'Lounge, Recreation',
      'Malls and Atria',
      'Medical and Clinical Care',
      'Office (Greater than 250 square feet in floor area)',
      'Office (250 square feet in floor area or less)',
      'Parking Garage Building, Parking Area',
      'Parking Garage Area Dedicated Ramps',
      'Parking Garage Area Daylight Adaptation Zones',
      'Police Station and Fire Station',
      'Religious Worship Area',
      'Retail Merchandise Sales, Wholesale Showroom',
      'Sports Arena, Indoor Playing Area',
      'Theater, Motion Picture',
      'Theater, Performance',
      'Transportation Function',
      'Videoconferencing Studio',
      'Waiting Area'
    ],
    spaces_conditioning_type_enums: [
      'DirectlyConditioned',
      'IndirectlyConditioned',
      'Unconditioned',
      'Plenum'
    ],
    spaces_envelope_status_enums: [
      'New',
      'Altered',
      'Existing'
    ],
    spaces_lighting_status_enums: [
      'New',
      'Altered',
      'Existing',
      'Future'
    ],
    luminaires_fixture_type_enums: [
      'RecessedWithLens',
      'RecessedOrDownlight',
      'NotInCeiling'
    ],
    luminaires_lamp_type_enums: [
      'LinearFluorescent',
      'CFL',
      'Incandescent',
      'LED',
      'MetalHalide',
      'MercuryVapor',
      'HighPressureSodium'
    ],
    interior_lighting_systems_status_enums: [
      'New',
      'Altered',
      'Existing',
      'Future'
    ],
    interior_lighting_systems_non_regulated_exclusion_enums: [
      'ThemeParksThemeAndSpecialEffects',
      'FilmOrPhotoStudioLightingSeparatelySwitched',
      'DanceFloorOrTheatrical',
      'TemporaryExhibitSeparatelySwitchedInCivicTransConvOrHotel',
      'ManufacturerInstalledInFreezerVendingFoodPrepScientificOrIndEquip',
      'ExamSurgicalNightOrEquipmentIntegratedInMedicalOrClinical',
      'PlantGrowthOrMaintWithMultiLevelAstroTimer',
      'LightingEquipmentForSale',
      'LightingDemonstrationEquipInLightingEducationFacilities',
      'CBCRequiredExitSign',
      'CBCRequiredExitwayOrEgressNormallyOff',
      'HotelMotelGuestroom',
      'HighRiseResidentialDwellingUnit',
      'TemporaryLightingSystems',
      'SmallAgriculturalBuilding',
      'SmallUnconditionedAgriculturalBuilding',
      'HistoricBuilding',
      'SmallNonresidentialParkingGarage',
      'SignageLighting',
      'ATMLighting',
      'SmallRefrigeratedCases',
      'ElevatorLighting'
    ],
    interior_lighting_systems_power_adjustment_factor_credit_type_enums: [
      '- none specified -',
      'PartialOnOccupantSensingControl',
      'OccupantSensingControls-1to125SF',
      'OccupantSensingControls-126to250SF',
      'OccupantSensingControls-251to500SF',
      'ManualDimming',
      'MultisceneProgrammableControls',
      'DemandResponsiveControl',
      'CombinedManualDimmingPlusPartialOnOccupantSensingControl'
    ],
    boilers_draft_type_enums: [
      'MechanicalNoncondensing',
      'Condensing',
      'Natural'
    ],
    pumps_operation_control_enums: [
      'OnDemand',
      'StandBy',
      'Scheduled'
    ],
    pumps_speed_control_enums: [
      'ConstantSpeed',
      'VariableSpeed'
    ],
    fans_classification_enums: [
      'Centrifugal',
      'Axial'
    ],
    fans_centrifugal_type_enums: [
      'AirFoil',
      'BackwardInclined',
      'ForwardCurved'
    ],
    fans_modeling_method_enums: [
      'StaticPressure',
      'BrakeHorsePower' /* don't show PowerPerUnitFlow option */
    ],
    fans_motor_type_enums: [
      'Open',
      'Enclosed'
    ],
    fans_motor_position_enums: [
      'InAirStream',
      'NotInAirStream'
    ],
    fans_control_method_enums: [
      'ConstantVolume',
      'VariableSpeedDrive',
      'Dampers',
      'InletVanes',
      'VariablePitchBlades',
      'TwoSpeed'
    ],
    coil_coolings_type_enums: [
      'ChilledWater',
      'DirectExpansion'
    ],
    coil_coolings_condenser_type_enums: [
      'Air',
      'WaterSource'
    ],
    coil_heatings_type_enums: [
      'Resistance',
      'Furnace',
      'HeatPump',
      'HotWater'
    ],
    fluid_systems_temperature_control_enums: [
      'Fixed',
      'Scheduled',
      'OutsideAirReset',
      'WetBulbReset',
      'FixedDualSetpoint',
      'ScheduledDualSetpoint'
    ],
    chillers_type_enums: [
      'Centrifugal',
      'Reciprocating',
      'Scroll',
      'Screw'
    ],
    chillers_condenser_type_enums: [
      'Air',
      'Fluid'
    ],
    heat_rejections_fan_type_enums: [
      'Axial',
      'Centrifugal'
    ],
    heat_rejections_modulation_control_enums: [
      'Bypass',
      'Cycling',
      'TwoSpeed',
      'VariableSpeedDrive'
    ],
    heat_rejections_type_enums: [
      'OpenTower',
      'ClosedTower',
      'GroundSourceHeatExchanger',
      'Lake',
      'Well'
    ],
    zones_type_enums: [
      'Conditioned',
      'Plenum',
      'Unconditioned'
    ],
    air_systems_sub_type_enums: [
      'SinglePackage',
      'SplitSystem',
      'CRAC',
      'CRAH'
    ],
    air_systems_reheat_control_method_enums: [
      'SingleMaximum',
      'DualMaximum'
    ],
    air_systems_cooling_control_enums: [
      'NoSATControl',
      'Fixed',
      'Scheduled',
      'OutsideAirReset',
      'WarmestResetFlowFirst',
      'WarmestResetTemperatureFirst',
      'WarmestReset'
    ],
    terminal_units_status_enums: [
      'New',
      'Existing'
    ],
    terminal_units_type_enums: [
      'Uncontrolled',
      'VAVReheatBox',
      'ParallelFanBox',
      'SeriesFanBox',
      'VAVNoReheatBox'
    ],
    terminal_units_reheat_control_method_enums: [
      'SingleMaximum',
      'DualMaximum'
    ],
    water_heaters_fuel_source_enums: [
      'Electricity',
      'FuelOil#1',
      'NaturalGas',
      'PropaneGas'
    ],
    water_heaters_off_cycle_fuel_source_enums: [
      'Electricity',
      'FuelOil#1',
      'NaturalGas',
      'PropaneGas'
    ],
    water_heaters_on_cycle_fuel_source_enums: [
      'Electricity',
      'FuelOil#1',
      'NaturalGas',
      'PropaneGas'
    ]
  };


  service.enumsArr = {};
  _.each(service.enums, function (arr, name) {
    service.enumsArr[name] = [];
    _.each(service.enums[name], function (value, index) {
      service.enumsArr[name].push({
        id: value,
        value: value
      });
    });
  });

  return service;
});
