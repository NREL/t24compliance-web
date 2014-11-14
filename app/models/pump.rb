class Pump
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :operation_control, type: String
  field :speed_control, type: String

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
			{"db_field_name"=>"speed_control", "xml_field_name"=>"SpdCtrl"}
		]
	end

	def to_sdd_xml
		builder = Nokogiri::XML::Builder.new do |xml|
			xml.send(:Pump) do
				xml_fields.each do |field|
					xml.send(:"#{field['xml_field_name']}", self[field['db_field_name']])
				end
				# go through children if they have something to add, call their methods
				kids = self.children_models
				unless kids.nil? or kids.empty?
					kids.each do |k|
						if k == 'building'
							xml << self.building
						else
							models = self[k.pluralize]
							models.each do |m|
								xml << m.to_sdd_xml
							end
						end
					end
				end
			end
		end
		builder.to_xml
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
end