class CoilCooling
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :type, type: String
  field :fluid_segment_in_reference, type: String
  field :fluid_segment_out_reference, type: String
  field :fluid_flow_rate_design, type: Float
  field :number_cooling_stages, type: Integer
  field :capacity_total_gross_rated, type: Float
  field :capacity_total_net_rated, type: Float
  field :capacity_total_rated_stage_fraction, type: Array
  field :dxseer, type: Float
  field :dxeer, type: Float
  field :dx_crankcase_control_temperature, type: Float
  field :dx_crankcase_heat_capacity, type: Float
  field :minimum_hot_gas_ratio, type: Float
  field :condenser_type, type: String
  field :auxilliary_power, type: Float

	belongs_to :air_segment
	belongs_to :zone_system


	def children_models
		children = [

		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"type", "xml_field_name"=>"Type"},
			{"db_field_name"=>"fluid_segment_in_reference", "xml_field_name"=>"FluidSegInRef"},
			{"db_field_name"=>"fluid_segment_out_reference", "xml_field_name"=>"FluidSegOutRef"},
			{"db_field_name"=>"fluid_flow_rate_design", "xml_field_name"=>"FluidFlowRtDsgn"},
			{"db_field_name"=>"number_cooling_stages", "xml_field_name"=>"NumClgStages"},
			{"db_field_name"=>"capacity_total_gross_rated", "xml_field_name"=>"CapTotGrossRtd"},
			{"db_field_name"=>"capacity_total_net_rated", "xml_field_name"=>"CapTotNetRtd"},
			{"db_field_name"=>"capacity_total_rated_stage_fraction", "xml_field_name"=>"CapTotRtdStageFrac"},
			{"db_field_name"=>"dxseer", "xml_field_name"=>"DXSEER"},
			{"db_field_name"=>"dxeer", "xml_field_name"=>"DXEER"},
			{"db_field_name"=>"dx_crankcase_control_temperature", "xml_field_name"=>"DXCrankcaseCtrlTemp"},
			{"db_field_name"=>"dx_crankcase_heat_capacity", "xml_field_name"=>"DXCrankcaseHtrCap"},
			{"db_field_name"=>"minimum_hot_gas_ratio", "xml_field_name"=>"MinHotGasRat"},
			{"db_field_name"=>"condenser_type", "xml_field_name"=>"CndsrType"},
			{"db_field_name"=>"auxilliary_power", "xml_field_name"=>"AuxPwr"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:CoilClg) do
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
			'ChilledWater',
			'DirectExpansion'
		]
	end

	def condenser_type_enums
		[
			'Air',
			'WaterSource'
		]
	end
end