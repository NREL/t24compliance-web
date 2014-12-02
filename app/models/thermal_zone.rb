class ThermalZone
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :type, type: String
  field :multiplier, type: Integer
  field :description, type: String
  field :supply_plenum_zone_reference, type: String
  field :return_plenum_zone_reference, type: String
  field :hvac_zone_count, type: Integer
  field :primary_air_conditioning_system_reference, type: String
  field :ventilation_system_reference, type: String
  field :cooling_design_supply_air_temperature, type: Float
  field :cooling_design_supply_air_temperature_difference, type: Float
  field :cooling_design_sizing_factor, type: Float
  field :heating_design_supply_air_temperature, type: Float
  field :heating_design_supply_air_temperature_difference, type: Float
  field :heating_design_sizing_factor, type: Float
  field :heating_design_maximum_flow_fraction, type: Float
  field :ventilation_source, type: String
  field :ventilation_control_method, type: String
  field :ventilation_specification_method, type: String
  field :daylighting_control_lighting_fraction1, type: Float
  field :daylighting_control_lighting_fraction2, type: Float
  field :daylighting_control_type, type: String
  field :daylighting_minimum_dimming_light_fraction, type: Float
  field :daylighting_minimum_dimming_power_fraction, type: Float
  field :daylighting_number_of_control_steps, type: Float
  field :exhaust_system_reference, type: String
  field :exhaust_fan_name, type: String
  field :exhaust_flow_simulated, type: Float

	belongs_to :building


	def children_models
		children = [

		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"type", "xml_field_name"=>"Type"},
			{"db_field_name"=>"multiplier", "xml_field_name"=>"Mult"},
			{"db_field_name"=>"description", "xml_field_name"=>"Desc"},
			{"db_field_name"=>"supply_plenum_zone_reference", "xml_field_name"=>"SupPlenumZnRef"},
			{"db_field_name"=>"return_plenum_zone_reference", "xml_field_name"=>"RetPlenumZnRef"},
			{"db_field_name"=>"hvac_zone_count", "xml_field_name"=>"HVACZnCnt"},
			{"db_field_name"=>"primary_air_conditioning_system_reference", "xml_field_name"=>"PriAirCondgSysRef"},
			{"db_field_name"=>"ventilation_system_reference", "xml_field_name"=>"VentSysRef"},
			{"db_field_name"=>"cooling_design_supply_air_temperature", "xml_field_name"=>"ClgDsgnSupAirTemp"},
			{"db_field_name"=>"cooling_design_supply_air_temperature_difference", "xml_field_name"=>"ClgDsgnSupAirTempDiff"},
			{"db_field_name"=>"cooling_design_sizing_factor", "xml_field_name"=>"ClgDsgnSizingFac"},
			{"db_field_name"=>"heating_design_supply_air_temperature", "xml_field_name"=>"HtgDsgnSupAirTemp"},
			{"db_field_name"=>"heating_design_supply_air_temperature_difference", "xml_field_name"=>"HtgDsgnSupAirTempDiff"},
			{"db_field_name"=>"heating_design_sizing_factor", "xml_field_name"=>"HtgDsgnSizingFac"},
			{"db_field_name"=>"heating_design_maximum_flow_fraction", "xml_field_name"=>"HtgDsgnMaxFlowFrac"},
			{"db_field_name"=>"ventilation_source", "xml_field_name"=>"VentSrc"},
			{"db_field_name"=>"ventilation_control_method", "xml_field_name"=>"VentCtrlMthd"},
			{"db_field_name"=>"ventilation_specification_method", "xml_field_name"=>"VentSpecMthd"},
			{"db_field_name"=>"daylighting_control_lighting_fraction1", "xml_field_name"=>"DayltgCtrlLtgFrac1"},
			{"db_field_name"=>"daylighting_control_lighting_fraction2", "xml_field_name"=>"DayltgCtrlLtgFrac2"},
			{"db_field_name"=>"daylighting_control_type", "xml_field_name"=>"DayltgCtrlType"},
			{"db_field_name"=>"daylighting_minimum_dimming_light_fraction", "xml_field_name"=>"DayltgMinDimLtgFrac"},
			{"db_field_name"=>"daylighting_minimum_dimming_power_fraction", "xml_field_name"=>"DayltgMinDimPwrFrac"},
			{"db_field_name"=>"daylighting_number_of_control_steps", "xml_field_name"=>"DayltgNumOfCtrlSteps"},
			{"db_field_name"=>"exhaust_system_reference", "xml_field_name"=>"ExhSysRef"},
			{"db_field_name"=>"exhaust_fan_name", "xml_field_name"=>"ExhFanName"},
			{"db_field_name"=>"exhaust_flow_simulated", "xml_field_name"=>"ExhFlowSim"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:ThrmlZn) do
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

	def type_enums
		[
			'Conditioned',
			'Plenum',
			'Unconditioned'
		]
	end

	def ventilation_source_enums
		[
			'None',
			'Forced'
		]
	end

	def ventilation_control_method_enums
		[
			'Fixed',
			'CO2Sensors'
		]
	end

	def ventilation_specification_method_enums
		[
			'NoVentilation',
			'Maximum',
			'Sum',
			'FlowPerPerson',
			'FlowPerArea',
			'AirChangesPerHour',
			'FlowPerZone'
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
end