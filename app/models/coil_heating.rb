class CoilHeating
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :type, type: String
  field :fuel_source, type: String
  field :fluid_segment_in_reference, type: String
  field :fluid_segment_out_reference, type: String
  field :fluid_flow_rate_design, type: Float
  field :capacity_total_gross_rated, type: Float
  field :capacity_total_net_rated, type: Float
  field :capacity_total_rated_stage_fraction, type: Array
  field :furnace_afue, type: Float
  field :furnace_thermal_efficiency, type: Float
  field :furnace_ignition_type, type: String
  field :furnace_pilot_fuel_input, type: Float
  field :condenser_type, type: String
  field :heat_pump_hspf, type: Float
  field :heat_pump_cop, type: Float
  field :heat_pump_supplemental_coil_heating_reference, type: String
  field :heat_pump_compressor_lockout_temperature, type: Float
  field :heat_pump_supplemental_temperature, type: Float
  field :heat_pump_crankcase_heat_capacity, type: Float
  field :heat_pump_crankcase_control_temperature, type: Float
  field :heat_pump_defrost_heat_source, type: String
  field :heat_pump_defrost_heat_capacity, type: Float
  field :heat_pump_defrost_control, type: String
  field :auxilliary_power, type: Float

	belongs_to :air_segment
	belongs_to :zone_system
	belongs_to :terminal_unit


	def children_models
		children = [

		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"type", "xml_field_name"=>"Type"},
			{"db_field_name"=>"fuel_source", "xml_field_name"=>"FuelSrc"},
			{"db_field_name"=>"fluid_segment_in_reference", "xml_field_name"=>"FluidSegInRef"},
			{"db_field_name"=>"fluid_segment_out_reference", "xml_field_name"=>"FluidSegOutRef"},
			{"db_field_name"=>"fluid_flow_rate_design", "xml_field_name"=>"FluidFlowRtDsgn"},
			{"db_field_name"=>"capacity_total_gross_rated", "xml_field_name"=>"CapTotGrossRtd"},
			{"db_field_name"=>"capacity_total_net_rated", "xml_field_name"=>"CapTotNetRtd"},
			{"db_field_name"=>"capacity_total_rated_stage_fraction", "xml_field_name"=>"CapTotRtdStageFrac"},
			{"db_field_name"=>"furnace_afue", "xml_field_name"=>"FurnAFUE"},
			{"db_field_name"=>"furnace_thermal_efficiency", "xml_field_name"=>"FurnThrmlEff"},
			{"db_field_name"=>"furnace_ignition_type", "xml_field_name"=>"FurnIgnType"},
			{"db_field_name"=>"furnace_pilot_fuel_input", "xml_field_name"=>"FurnPilotFuelInp"},
			{"db_field_name"=>"condenser_type", "xml_field_name"=>"CndsrType"},
			{"db_field_name"=>"heat_pump_hspf", "xml_field_name"=>"HtPumpHSPF"},
			{"db_field_name"=>"heat_pump_cop", "xml_field_name"=>"HtPumpCOP"},
			{"db_field_name"=>"heat_pump_supplemental_coil_heating_reference", "xml_field_name"=>"HtPumpSuppCoilHtgRef"},
			{"db_field_name"=>"heat_pump_compressor_lockout_temperature", "xml_field_name"=>"HtPumpCprsrLockoutTemp"},
			{"db_field_name"=>"heat_pump_supplemental_temperature", "xml_field_name"=>"HtPumpSuppTemp"},
			{"db_field_name"=>"heat_pump_crankcase_heat_capacity", "xml_field_name"=>"HtPumpCrankcaseHtrCap"},
			{"db_field_name"=>"heat_pump_crankcase_control_temperature", "xml_field_name"=>"HtPumpCrankcaseCtrlTemp"},
			{"db_field_name"=>"heat_pump_defrost_heat_source", "xml_field_name"=>"HtPumpDefHtSrc"},
			{"db_field_name"=>"heat_pump_defrost_heat_capacity", "xml_field_name"=>"HtPumpDefHtrCap"},
			{"db_field_name"=>"heat_pump_defrost_control", "xml_field_name"=>"HtPumpDefCtrl"},
			{"db_field_name"=>"auxilliary_power", "xml_field_name"=>"AuxPwr"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:CoilHtg) do
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
			'- specify -',
			'Resistance',
			'Furnace',
			'HeatPump',
			'HotWater'
		]
	end

	def fuel_source_enums
		[
			'- specify -',
			'Electric',
			'NaturalGas',
			'Oil'
		]
	end

	def furnace_ignition_type_enums
		[
			'IntermittentIgnitionDevice',
			'PilotLight'
		]
	end

	def condenser_type_enums
		[
			'Air',
			'WaterSource'
		]
	end

	def heat_pump_defrost_heat_source_enums
		[
			'Electric',
			'HotGas'
		]
	end

	def heat_pump_defrost_control_enums
		[
			'OnDemand',
			'TimedCycle'
		]
	end
end