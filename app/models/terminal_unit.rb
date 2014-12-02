class TerminalUnit
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :type, type: String
  field :zone_served_reference, type: String
  field :count, type: Integer
  field :minimum_air_fraction_schedule_reference, type: String
  field :primary_air_segment_reference, type: String
  field :primary_air_flow_maximum, type: Float
  field :primary_air_flow_minimum, type: Float
  field :heating_air_flow_maximum, type: Float
  field :reheat_control_method, type: String
  field :induced_air_zone_reference, type: String
  field :induction_ratio, type: Float
  field :fan_power_per_flow, type: Float
  field :parallel_box_fan_flow_fraction, type: Float

	belongs_to :air_system
	has_many :coil_heatings
	has_many :fans


	def children_models
		children = [
			'coil_heating',
			'fan'
		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"status", "xml_field_name"=>"Status"},
			{"db_field_name"=>"type", "xml_field_name"=>"Type"},
			{"db_field_name"=>"zone_served_reference", "xml_field_name"=>"ZnServedRef"},
			{"db_field_name"=>"count", "xml_field_name"=>"Cnt"},
			{"db_field_name"=>"minimum_air_fraction_schedule_reference", "xml_field_name"=>"MinAirFracSchRef"},
			{"db_field_name"=>"primary_air_segment_reference", "xml_field_name"=>"PriAirSegRef"},
			{"db_field_name"=>"primary_air_flow_maximum", "xml_field_name"=>"PriAirFlowMax"},
			{"db_field_name"=>"primary_air_flow_minimum", "xml_field_name"=>"PriAirFlowMin"},
			{"db_field_name"=>"heating_air_flow_maximum", "xml_field_name"=>"HtgAirFlowMax"},
			{"db_field_name"=>"reheat_control_method", "xml_field_name"=>"ReheatCtrlMthd"},
			{"db_field_name"=>"induced_air_zone_reference", "xml_field_name"=>"InducedAirZnRef"},
			{"db_field_name"=>"induction_ratio", "xml_field_name"=>"InductionRat"},
			{"db_field_name"=>"fan_power_per_flow", "xml_field_name"=>"FanPwrPerFlow"},
			{"db_field_name"=>"parallel_box_fan_flow_fraction", "xml_field_name"=>"ParallelBoxFanFlowFrac"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:TrmlUnit) do
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
			'Existing'
		]
	end

	def type_enums
		[
			'- specify -',
			'Uncontrolled',
			'VAVReheatBox',
			'ParallelFanBox',
			'SeriesFanBox',
			'VAVNoReheatBox'
		]
	end

	def reheat_control_method_enums
		[
			'SingleMaximum',
			'DualMaximum'
		]
	end
end