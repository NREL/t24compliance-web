class AirSegment
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String

	belongs_to :air_system
	has_many :evaporative_coolers
	has_many :coil_coolings
	has_many :coil_heatings
	has_many :fans


	def children_models
		children = [
			'evaporative_cooler',
			'coil_cooling',
			'coil_heating',
			'fan'
		]
	end

	def xml_fields
		xml_fields = [

		]
	end

	def to_sdd_xml(xml)
		xml.send(:AirSeg) do
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
end