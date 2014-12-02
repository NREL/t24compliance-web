class Pump
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :operation_control, type: String
  field :speed_control, type: String
  field :modeling_method, type: String
  field :count, type: Integer
  field :flow_capacity, type: Float
  field :total_head, type: Float
  field :flow_minimum, type: Float
  field :minimum_speed_ratio, type: Float
  field :motor_efficiency, type: Float
  field :impeller_efficiency, type: Float
  field :motor_hp, type: Float

	belongs_to :fluid_segment
	belongs_to :chiller
	belongs_to :boiler
	belongs_to :water_heater
	belongs_to :heat_rejection


	def children_models
		children = [

		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"status", "xml_field_name"=>"Status"},
			{"db_field_name"=>"operation_control", "xml_field_name"=>"OperCtrl"},
			{"db_field_name"=>"speed_control", "xml_field_name"=>"SpdCtrl"},
			{"db_field_name"=>"modeling_method", "xml_field_name"=>"ModelingMthd"},
			{"db_field_name"=>"count", "xml_field_name"=>"Cnt"},
			{"db_field_name"=>"flow_capacity", "xml_field_name"=>"FlowCap"},
			{"db_field_name"=>"total_head", "xml_field_name"=>"TotHd"},
			{"db_field_name"=>"flow_minimum", "xml_field_name"=>"FlowMin"},
			{"db_field_name"=>"minimum_speed_ratio", "xml_field_name"=>"MinSpdRat"},
			{"db_field_name"=>"motor_efficiency", "xml_field_name"=>"MtrEff"},
			{"db_field_name"=>"impeller_efficiency", "xml_field_name"=>"ImpellerEff"},
			{"db_field_name"=>"motor_hp", "xml_field_name"=>"MtrHP"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:Pump) do
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

	def operation_control_enums
		[
			'OnDemand',
			'StandBy',
			'Scheduled'
		]
	end

	def speed_control_enums
		[
			'ConstantSpeed',
			'VariableSpeed'
		]
	end

	def modeling_method_enums
		[
			'Detailed',
			'PowerPerUnitFlow'
		]
	end
end