class Space
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :conditioning_type, type: String
  field :supply_plenum_space_reference, type: String
  field :return_plenum_space_reference, type: String
  field :thermal_zone_reference, type: String
  field :area, type: Float
  field :floor_area, type: Float
  field :floor_z, type: Float
  field :floor_to_ceiling_height, type: Float
  field :volume, type: Float
  field :space_function_defaults_reference, type: String
  field :space_function, type: String
  field :function_schedule_group, type: String
  field :occupant_density, type: Float
  field :occupant_sensible_heat_rate, type: Float
  field :occupant_latent_heat_rate, type: Float
  field :occupant_schedule_reference, type: String
  field :infiltration_method, type: Array
  field :design_infiltration_rate, type: Array
  field :infiltration_schedule_reference, type: Array
  field :infiltration_model_coefficient_a, type: Array
  field :infiltration_model_coefficient_b, type: Array
  field :infiltration_model_coefficient_c, type: Array
  field :infiltration_model_coefficient_d, type: Array
  field :envelope_status, type: String
  field :lighting_status, type: String
  field :interior_lighting_specification_method, type: String
  field :interior_lighting_power_density_regulated, type: Float
  field :interior_lighting_regulated_schedule_reference, type: String
  field :interior_lighting_regulated_heat_gain_space_fraction, type: Float
  field :interior_lighting_regulated_heat_gain_radiant_fraction, type: Float
  field :interior_lighting_power_density_non_regulated, type: Float
  field :interior_lighting_non_regulated_schedule_reference, type: String
  field :interior_lighting_non_regulated_heat_gain_space_fraction, type: Float
  field :interior_lighting_non_regulated_heat_gain_radiant_fraction, type: Float
  field :skylit_daylighting_installed_lighting_power, type: Float
  field :primary_side_daylighting_installed_lighting_power, type: Float
  field :secondary_side_daylighting_installed_lighting_power, type: Float
  field :skylit100_percent_controlled, type: Integer
  field :primary_sidelit100_percent_controlled, type: Integer
  field :secondary_sidelit100_percent_controlled, type: Integer
  field :skylit_daylighting_reference_point_coordinate, type: Array
  field :skylit_daylighting_controlled_lighting_power, type: Float
  field :skylit_daylighting_control_lighting_fraction, type: Float
  field :skylit_daylighting_illuminance_set_point, type: Float
  field :primary_side_daylighting_reference_point_coordinate, type: Array
  field :primary_side_daylighting_controlled_lighting_power, type: Float
  field :primary_side_daylighting_control_lighting_fraction, type: Float
  field :primary_side_daylighting_illuminance_set_point, type: Float
  field :secondary_side_daylighting_reference_point_coordinate, type: Array
  field :secondary_side_daylighting_controlled_lighting_power, type: Float
  field :secondary_side_daylighting_control_lighting_fraction, type: Float
  field :secondary_side_daylighting_illuminance_set_point, type: Float
  field :daylighting_control_type, type: String
  field :minimum_dimming_light_fraction, type: Float
  field :minimum_dimming_power_fraction, type: Float
  field :number_of_control_steps, type: Integer
  field :glare_azimuth, type: Float
  field :maximum_glare_index, type: Float
  field :skylight_requirement_exception, type: String
  field :skylight_requirement_exception_area, type: Float
  field :skylight_requirement_exception_fraction, type: Float
  field :receptacle_power_density, type: Float
  field :receptacle_schedule_reference, type: String
  field :receptacle_radiation_fraction, type: Float
  field :receptacle_latent_fraction, type: Float
  field :receptacle_lost_fraction, type: Float
  field :gas_equipment_power_density, type: Float
  field :gas_equipment_schedule_reference, type: String
  field :gas_equipment_radiation_fraction, type: Float
  field :gas_equipment_latent_fraction, type: Float
  field :gas_equipment_lost_fraction, type: Float
  field :process_electrical_power_density, type: Float
  field :process_electrical_schedule_reference, type: String
  field :process_electrical_radiation_fraction, type: Float
  field :process_electrical_latent_fraction, type: Float
  field :process_electrical_lost_fraction, type: Float
  field :process_gas_power_density, type: Float
  field :process_gas_schedule_reference, type: String
  field :process_gas_radiation_fraction, type: Float
  field :process_gas_latent_fraction, type: Float
  field :process_gas_lost_fraction, type: Float
  field :commercial_refrigeration_epd, type: Float
  field :commercial_refrigeration_equipment_schedule_reference, type: String
  field :commercial_refrigeration_radiation_fraction, type: Float
  field :commercial_refrigeration_latent_fraction, type: Float
  field :commercial_refrigeration_lost_fraction, type: Float
  field :elevator_count, type: Integer
  field :elevator_power, type: Float
  field :elevator_schedule_reference, type: String
  field :elevator_radiation_fraction, type: Float
  field :elevator_latent_fraction, type: Float
  field :elevator_lost_fraction, type: Float
  field :escalator_count, type: Integer
  field :escalator_power, type: Float
  field :escalator_schedule_reference, type: String
  field :escalator_radiation_fraction, type: Float
  field :escalator_latent_fraction, type: Float
  field :escalator_lost_fraction, type: Float
  field :shw_fluid_segment_reference, type: String
  field :recirculation_dhw_system_reference, type: String
  field :hot_water_heating_rate, type: Float
  field :recirculation_hot_water_heating_rate, type: Float
  field :hot_water_heating_schedule_reference, type: String
  field :ventilation_per_person, type: Float
  field :ventilation_per_area, type: Float
  field :ventilation_air_changes_per_hour, type: Float
  field :ventilation_per_space, type: Float
  field :exhaust_per_area, type: Float
  field :exhaust_air_changes_per_hour, type: Float
  field :exhaust_per_space, type: Float
  field :kitchen_exhaust_hood_length, type: Array
  field :kitchen_exhaust_hood_style, type: Array
  field :kitchen_exhaust_hood_duty, type: Array
  field :kitchen_exhaust_hood_flow, type: Array
  field :lab_exhaust_rate_type, type: String
  field :interior_lighting_power_density_prescriptive, type: Float
  field :is_plenum_return, type: Integer
  field :high_rise_residential_integer, type: Integer
  field :high_rise_residential_conditioned_floor_area, type: Float

	belongs_to :building_story
	has_many :interior_lighting_systems
	has_many :ceilings
	has_many :exterior_floors
	has_many :exterior_walls
	has_many :interior_floors
	has_many :interior_walls
	has_many :roofs
	has_many :underground_floors
	has_many :underground_walls
	has_many :external_shading_objects
	has_many :poly_loops


	def children_models
		children = [
			'interior_lighting_system',
			'ceiling',
			'exterior_floor',
			'exterior_wall',
			'interior_floor',
			'interior_wall',
			'roof',
			'underground_floor',
			'underground_wall',
			'external_shading_object',
			'poly_loop'
		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"status", "xml_field_name"=>"Status"},
			{"db_field_name"=>"conditioning_type", "xml_field_name"=>"CondgType"},
			{"db_field_name"=>"supply_plenum_space_reference", "xml_field_name"=>"SupPlenumSpcRef"},
			{"db_field_name"=>"return_plenum_space_reference", "xml_field_name"=>"RetPlenumSpcRef"},
			{"db_field_name"=>"thermal_zone_reference", "xml_field_name"=>"ThrmlZnRef"},
			{"db_field_name"=>"area", "xml_field_name"=>"Area"},
			{"db_field_name"=>"floor_area", "xml_field_name"=>"FlrArea"},
			{"db_field_name"=>"floor_z", "xml_field_name"=>"FlrZ"},
			{"db_field_name"=>"floor_to_ceiling_height", "xml_field_name"=>"FlrToCeilingHgt"},
			{"db_field_name"=>"volume", "xml_field_name"=>"Vol"},
			{"db_field_name"=>"space_function_defaults_reference", "xml_field_name"=>"SpcFuncDefaultsRef"},
			{"db_field_name"=>"space_function", "xml_field_name"=>"SpcFunc"},
			{"db_field_name"=>"function_schedule_group", "xml_field_name"=>"FuncSchGrp"},
			{"db_field_name"=>"occupant_density", "xml_field_name"=>"OccDens"},
			{"db_field_name"=>"occupant_sensible_heat_rate", "xml_field_name"=>"OccSensHtRt"},
			{"db_field_name"=>"occupant_latent_heat_rate", "xml_field_name"=>"OccLatHtRt"},
			{"db_field_name"=>"occupant_schedule_reference", "xml_field_name"=>"OccSchRef"},
			{"db_field_name"=>"infiltration_method", "xml_field_name"=>"InfMthd"},
			{"db_field_name"=>"design_infiltration_rate", "xml_field_name"=>"DsgnInfRt"},
			{"db_field_name"=>"infiltration_schedule_reference", "xml_field_name"=>"InfSchRef"},
			{"db_field_name"=>"infiltration_model_coefficient_a", "xml_field_name"=>"InfModelCoefA"},
			{"db_field_name"=>"infiltration_model_coefficient_b", "xml_field_name"=>"InfModelCoefB"},
			{"db_field_name"=>"infiltration_model_coefficient_c", "xml_field_name"=>"InfModelCoefC"},
			{"db_field_name"=>"infiltration_model_coefficient_d", "xml_field_name"=>"InfModelCoefD"},
			{"db_field_name"=>"envelope_status", "xml_field_name"=>"EnvStatus"},
			{"db_field_name"=>"lighting_status", "xml_field_name"=>"LtgStatus"},
			{"db_field_name"=>"interior_lighting_specification_method", "xml_field_name"=>"IntLtgSpecMthd"},
			{"db_field_name"=>"interior_lighting_power_density_regulated", "xml_field_name"=>"IntLPDReg"},
			{"db_field_name"=>"interior_lighting_regulated_schedule_reference", "xml_field_name"=>"IntLtgRegSchRef"},
			{"db_field_name"=>"interior_lighting_regulated_heat_gain_space_fraction", "xml_field_name"=>"IntLtgRegHtGnSpcFrac"},
			{"db_field_name"=>"interior_lighting_regulated_heat_gain_radiant_fraction", "xml_field_name"=>"IntLtgRegHtGnRadFrac"},
			{"db_field_name"=>"interior_lighting_power_density_non_regulated", "xml_field_name"=>"IntLPDNonReg"},
			{"db_field_name"=>"interior_lighting_non_regulated_schedule_reference", "xml_field_name"=>"IntLtgNonRegSchRef"},
			{"db_field_name"=>"interior_lighting_non_regulated_heat_gain_space_fraction", "xml_field_name"=>"IntLtgNonRegHtGnSpcFrac"},
			{"db_field_name"=>"interior_lighting_non_regulated_heat_gain_radiant_fraction", "xml_field_name"=>"IntLtgNonRegHtGnRadFrac"},
			{"db_field_name"=>"skylit_daylighting_installed_lighting_power", "xml_field_name"=>"SkylitDayltgInstalledLtgPwr"},
			{"db_field_name"=>"primary_side_daylighting_installed_lighting_power", "xml_field_name"=>"PriSideDayltgInstalledLtgPwr"},
			{"db_field_name"=>"secondary_side_daylighting_installed_lighting_power", "xml_field_name"=>"SecSideDayltgInstalledLtgPwr"},
			{"db_field_name"=>"skylit100_percent_controlled", "xml_field_name"=>"Skylit100PctControlled"},
			{"db_field_name"=>"primary_sidelit100_percent_controlled", "xml_field_name"=>"PriSide100PctControlled"},
			{"db_field_name"=>"secondary_sidelit100_percent_controlled", "xml_field_name"=>"SecSide100PctControlled"},
			{"db_field_name"=>"skylit_daylighting_reference_point_coordinate", "xml_field_name"=>"SkylitDayltgRefPtCoord"},
			{"db_field_name"=>"skylit_daylighting_controlled_lighting_power", "xml_field_name"=>"SkylitDayltgCtrlLtgPwr"},
			{"db_field_name"=>"skylit_daylighting_control_lighting_fraction", "xml_field_name"=>"SkylitDayltgCtrlLtgFrac"},
			{"db_field_name"=>"skylit_daylighting_illuminance_set_point", "xml_field_name"=>"SkylitDayltgIllumSetpt"},
			{"db_field_name"=>"primary_side_daylighting_reference_point_coordinate", "xml_field_name"=>"PriSideDayltgRefPtCoord"},
			{"db_field_name"=>"primary_side_daylighting_controlled_lighting_power", "xml_field_name"=>"PriSideDayltgCtrlLtgPwr"},
			{"db_field_name"=>"primary_side_daylighting_control_lighting_fraction", "xml_field_name"=>"PriSideDayltgCtrlLtgFrac"},
			{"db_field_name"=>"primary_side_daylighting_illuminance_set_point", "xml_field_name"=>"PriSideDayltgIllumSetpt"},
			{"db_field_name"=>"secondary_side_daylighting_reference_point_coordinate", "xml_field_name"=>"SecSideDayltgRefPtCoord"},
			{"db_field_name"=>"secondary_side_daylighting_controlled_lighting_power", "xml_field_name"=>"SecSideDayltgCtrlLtgPwr"},
			{"db_field_name"=>"secondary_side_daylighting_control_lighting_fraction", "xml_field_name"=>"SecSideDayltgCtrlLtgFrac"},
			{"db_field_name"=>"secondary_side_daylighting_illuminance_set_point", "xml_field_name"=>"SecSideDayltgIllumSetpt"},
			{"db_field_name"=>"daylighting_control_type", "xml_field_name"=>"DayltgCtrlType"},
			{"db_field_name"=>"minimum_dimming_light_fraction", "xml_field_name"=>"MinDimLtgFrac"},
			{"db_field_name"=>"minimum_dimming_power_fraction", "xml_field_name"=>"MinDimPwrFrac"},
			{"db_field_name"=>"number_of_control_steps", "xml_field_name"=>"NumOfCtrlSteps"},
			{"db_field_name"=>"glare_azimuth", "xml_field_name"=>"GlrAz"},
			{"db_field_name"=>"maximum_glare_index", "xml_field_name"=>"MaxGlrIdx"},
			{"db_field_name"=>"skylight_requirement_exception", "xml_field_name"=>"SkyltReqExcpt"},
			{"db_field_name"=>"skylight_requirement_exception_area", "xml_field_name"=>"SkyltReqExcptArea"},
			{"db_field_name"=>"skylight_requirement_exception_fraction", "xml_field_name"=>"SkyltReqExcptFrac"},
			{"db_field_name"=>"receptacle_power_density", "xml_field_name"=>"RecptPwrDens"},
			{"db_field_name"=>"receptacle_schedule_reference", "xml_field_name"=>"RecptSchRef"},
			{"db_field_name"=>"receptacle_radiation_fraction", "xml_field_name"=>"RecptRadFrac"},
			{"db_field_name"=>"receptacle_latent_fraction", "xml_field_name"=>"RecptLatFrac"},
			{"db_field_name"=>"receptacle_lost_fraction", "xml_field_name"=>"RecptLostFrac"},
			{"db_field_name"=>"gas_equipment_power_density", "xml_field_name"=>"GasEqpPwrDens"},
			{"db_field_name"=>"gas_equipment_schedule_reference", "xml_field_name"=>"GasEqpSchRef"},
			{"db_field_name"=>"gas_equipment_radiation_fraction", "xml_field_name"=>"GasEqpRadFrac"},
			{"db_field_name"=>"gas_equipment_latent_fraction", "xml_field_name"=>"GasEqpLatFrac"},
			{"db_field_name"=>"gas_equipment_lost_fraction", "xml_field_name"=>"GasEqpLostFrac"},
			{"db_field_name"=>"process_electrical_power_density", "xml_field_name"=>"ProcElecPwrDens"},
			{"db_field_name"=>"process_electrical_schedule_reference", "xml_field_name"=>"ProcElecSchRef"},
			{"db_field_name"=>"process_electrical_radiation_fraction", "xml_field_name"=>"ProcElecRadFrac"},
			{"db_field_name"=>"process_electrical_latent_fraction", "xml_field_name"=>"ProcElecLatFrac"},
			{"db_field_name"=>"process_electrical_lost_fraction", "xml_field_name"=>"ProcElecLostFrac"},
			{"db_field_name"=>"process_gas_power_density", "xml_field_name"=>"ProcGasPwrDens"},
			{"db_field_name"=>"process_gas_schedule_reference", "xml_field_name"=>"ProcGasSchRef"},
			{"db_field_name"=>"process_gas_radiation_fraction", "xml_field_name"=>"ProcGasRadFrac"},
			{"db_field_name"=>"process_gas_latent_fraction", "xml_field_name"=>"ProcGasLatFrac"},
			{"db_field_name"=>"process_gas_lost_fraction", "xml_field_name"=>"ProcGasLostFrac"},
			{"db_field_name"=>"commercial_refrigeration_epd", "xml_field_name"=>"CommRfrgEPD"},
			{"db_field_name"=>"commercial_refrigeration_equipment_schedule_reference", "xml_field_name"=>"CommRfrgEqpSchRef"},
			{"db_field_name"=>"commercial_refrigeration_radiation_fraction", "xml_field_name"=>"CommRfrgRadFrac"},
			{"db_field_name"=>"commercial_refrigeration_latent_fraction", "xml_field_name"=>"CommRfrgLatFrac"},
			{"db_field_name"=>"commercial_refrigeration_lost_fraction", "xml_field_name"=>"CommRfrgLostFrac"},
			{"db_field_name"=>"elevator_count", "xml_field_name"=>"ElevCnt"},
			{"db_field_name"=>"elevator_power", "xml_field_name"=>"ElevPwr"},
			{"db_field_name"=>"elevator_schedule_reference", "xml_field_name"=>"ElevSchRef"},
			{"db_field_name"=>"elevator_radiation_fraction", "xml_field_name"=>"ElevRadFrac"},
			{"db_field_name"=>"elevator_latent_fraction", "xml_field_name"=>"ElevLatFrac"},
			{"db_field_name"=>"elevator_lost_fraction", "xml_field_name"=>"ElevLostFrac"},
			{"db_field_name"=>"escalator_count", "xml_field_name"=>"EscalCnt"},
			{"db_field_name"=>"escalator_power", "xml_field_name"=>"EscalPwr"},
			{"db_field_name"=>"escalator_schedule_reference", "xml_field_name"=>"EscalSchRef"},
			{"db_field_name"=>"escalator_radiation_fraction", "xml_field_name"=>"EscalRadFrac"},
			{"db_field_name"=>"escalator_latent_fraction", "xml_field_name"=>"EscalLatFrac"},
			{"db_field_name"=>"escalator_lost_fraction", "xml_field_name"=>"EscalLostFrac"},
			{"db_field_name"=>"shw_fluid_segment_reference", "xml_field_name"=>"SHWFluidSegRef"},
			{"db_field_name"=>"recirculation_dhw_system_reference", "xml_field_name"=>"RecircDHWSysRef"},
			{"db_field_name"=>"hot_water_heating_rate", "xml_field_name"=>"HotWtrHtgRt"},
			{"db_field_name"=>"recirculation_hot_water_heating_rate", "xml_field_name"=>"RecircHotWtrHtgRt"},
			{"db_field_name"=>"hot_water_heating_schedule_reference", "xml_field_name"=>"HotWtrHtgSchRef"},
			{"db_field_name"=>"ventilation_per_person", "xml_field_name"=>"VentPerPerson"},
			{"db_field_name"=>"ventilation_per_area", "xml_field_name"=>"VentPerArea"},
			{"db_field_name"=>"ventilation_air_changes_per_hour", "xml_field_name"=>"VentACH"},
			{"db_field_name"=>"ventilation_per_space", "xml_field_name"=>"VentPerSpc"},
			{"db_field_name"=>"exhaust_per_area", "xml_field_name"=>"ExhPerArea"},
			{"db_field_name"=>"exhaust_air_changes_per_hour", "xml_field_name"=>"ExhACH"},
			{"db_field_name"=>"exhaust_per_space", "xml_field_name"=>"ExhPerSpc"},
			{"db_field_name"=>"kitchen_exhaust_hood_length", "xml_field_name"=>"KitExhHoodLen"},
			{"db_field_name"=>"kitchen_exhaust_hood_style", "xml_field_name"=>"KitExhHoodStyle"},
			{"db_field_name"=>"kitchen_exhaust_hood_duty", "xml_field_name"=>"KitExhHoodDuty"},
			{"db_field_name"=>"kitchen_exhaust_hood_flow", "xml_field_name"=>"KitExhHoodFlow"},
			{"db_field_name"=>"lab_exhaust_rate_type", "xml_field_name"=>"LabExhRtType"},
			{"db_field_name"=>"interior_lighting_power_density_prescriptive", "xml_field_name"=>"IntLPDPrescrip"},
			{"db_field_name"=>"is_plenum_return", "xml_field_name"=>"IsPlenumRet"},
			{"db_field_name"=>"high_rise_residential_integer", "xml_field_name"=>"HighRiseResInt"},
			{"db_field_name"=>"high_rise_residential_conditioned_floor_area", "xml_field_name"=>"HighRiseResCondFlrArea"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:Spc) do
			xml_fields.each do |field|
				xml.send(:"#{field['xml_field_name']}", self[field['db_field_name']])
			end
			# go through children if they have something to add, call their methods
			kids = self.children_models
			unless kids.nil? or kids.empty?
				kids.each do |k|
					models = self.send(k.pluralize)
					models.each do |m|
						m.to_sdd_xml(xml)
					end
				end
			end
		end
	end

	def status_enums
		[
			'New',
			'Existing',
			'Altered'
		]
	end

	def conditioning_type_enums
		[
			'DirectlyConditioned',
			'IndirectlyConditioned',
			'Unconditioned',
			'Plenum'
		]
	end

	def space_function_enums
		[
			'- specify -',
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
			'Housing, Public and Common Areas',
			'Housing, Public and Common Areas',
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
		]
	end

	def function_schedule_group_enums
		[
			'- specify -',
			'Assembly',
			'Data',
			'Health',
			'Laboratory',
			'Manufacturing',
			'Office',
			'Parking',
			'ResidentialLiving',
			'ResidentialCommon',
			'Restaurant',
			'Retail',
			'School',
			'Warehouse'
		]
	end

	def envelope_status_enums
		[
			'New',
			'Altered',
			'Existing'
		]
	end

	def lighting_status_enums
		[
			'New',
			'Altered',
			'Existing',
			'Future'
		]
	end

	def daylighting_control_type_enums
		[
			'None',
			'Continuous',
			'ContinuousPlusOff',
			'SteppedSwitching'
		]
	end

	def skylight_requirement_exception_enums
		[
			'- none -',
			'Auditorium',
			'Church',
			'MovieTheater',
			'Museum',
			'RefrigeratedWarehouse',
			'ExistingWalls',
			'FutureWalls',
			'FutureCeilings'
		]
	end

	def lab_exhaust_rate_type_enums
		[
			'HoodDominated',
			'LoadDominated'
		]
	end
end