class FluidSystem
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :type, type: String
  field :description, type: String
  field :design_supply_water_temperature, type: Float
  field :heating_design_supply_water_temperature, type: Float
  field :design_supply_water_temperature_delta_t, type: Float
  field :control_type, type: String
  field :temperature_control, type: String
  field :fixed_supply_temperature, type: Float
  field :temperature_setpoint_schedule_reference, type: String
  field :heating_fixed_supply_temperature, type: Float
  field :heating_temperature_setpoint_schedule_reference, type: String
  field :reset_supply_high, type: Float
  field :reset_supply_low, type: Float
  field :reset_outdoor_high, type: Float
  field :reset_outdoor_low, type: Float
  field :wet_bulb_approach, type: Float
  field :cooling_supply_temperature, type: Float
  field :heating_supply_temperature, type: Float
  field :evaporator_fluid_segment_in_reference, type: String
  field :shw_system_count, type: Integer
  field :annual_solar_fraction, type: Float

	has_many :fluid_segments
	has_many :chillers
	has_many :boilers
	has_many :heat_rejections
	has_many :water_heaters


	def children_models
		children = [
			'fluid_segment',
			'chiller',
			'boiler',
			'heat_rejection',
			'water_heater'
		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"status", "xml_field_name"=>"Status"},
			{"db_field_name"=>"type", "xml_field_name"=>"Type"},
			{"db_field_name"=>"description", "xml_field_name"=>"Desc"},
			{"db_field_name"=>"design_supply_water_temperature", "xml_field_name"=>"DsgnSupWtrTemp"},
			{"db_field_name"=>"heating_design_supply_water_temperature", "xml_field_name"=>"HtgDsgnSupWtrTemp"},
			{"db_field_name"=>"design_supply_water_temperature_delta_t", "xml_field_name"=>"DsgnSupWtrDelT"},
			{"db_field_name"=>"control_type", "xml_field_name"=>"CtrlType"},
			{"db_field_name"=>"temperature_control", "xml_field_name"=>"TempCtrl"},
			{"db_field_name"=>"fixed_supply_temperature", "xml_field_name"=>"FixedSupTemp"},
			{"db_field_name"=>"temperature_setpoint_schedule_reference", "xml_field_name"=>"TempSetptSchRef"},
			{"db_field_name"=>"heating_fixed_supply_temperature", "xml_field_name"=>"HtgFixedSupTemp"},
			{"db_field_name"=>"heating_temperature_setpoint_schedule_reference", "xml_field_name"=>"HtgTempSetptSchRef"},
			{"db_field_name"=>"reset_supply_high", "xml_field_name"=>"RstSupHi"},
			{"db_field_name"=>"reset_supply_low", "xml_field_name"=>"RstSupLow"},
			{"db_field_name"=>"reset_outdoor_high", "xml_field_name"=>"RstOutdrHi"},
			{"db_field_name"=>"reset_outdoor_low", "xml_field_name"=>"RstOutdrLow"},
			{"db_field_name"=>"wet_bulb_approach", "xml_field_name"=>"WetBulbApproach"},
			{"db_field_name"=>"cooling_supply_temperature", "xml_field_name"=>"ClgSupTemp"},
			{"db_field_name"=>"heating_supply_temperature", "xml_field_name"=>"HtgSupTemp"},
			{"db_field_name"=>"evaporator_fluid_segment_in_reference", "xml_field_name"=>"EvapFluidSegInRef"},
			{"db_field_name"=>"shw_system_count", "xml_field_name"=>"SHWSysCnt"},
			{"db_field_name"=>"annual_solar_fraction", "xml_field_name"=>"AnnualSolFrac"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:FluidSys) do
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

	def type_enums
		[
			'- specify -',
			'ChilledWater',
			'CondenserWater',
			'HotWater',
			'ServiceHotWater'
		]
	end

	def control_type_enums
		[
			'DDC',
			'Other'
		]
	end

	def temperature_control_enums
		[
			'Fixed',
			'Scheduled',
			'OutsideAirReset',
			'WetBulbReset',
			'FixedDualSetpoint',
			'ScheduledDualSetpoint'
		]
	end
end