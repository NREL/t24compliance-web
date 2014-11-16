class Fan
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :control_method, type: String
  field :classification, type: String

	belongs_to :air_segment
	belongs_to :zone_system
	belongs_to :terminal_unit


	def children_models
		children = [

		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"control_method", "xml_field_name"=>"CtrlMthd"},
			{"db_field_name"=>"classification", "xml_field_name"=>"Class"}
		]
	end

	def to_sdd_xml
		builder = Nokogiri::XML::Builder.new do |xml|
			xml.send(:Fan) do
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

	def control_method_enums
		[
			'ConstantVolume',
			'VariableSpeedDrive',
			'Dampers',
			'InletVanes',
			'VariablePitchBlades',
			'TwoSpeed'
		]
	end

	def classification_enums
		[
			'Centrifugal',
			'Axial'
		]
	end
end