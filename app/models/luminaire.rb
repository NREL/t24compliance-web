class Luminaire
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :fixture_type, type: String
  field :lamp_type, type: String

	belongs_to :project


	def children_models
		children = [

		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"fixture_type", "xml_field_name"=>"FxtrType"},
			{"db_field_name"=>"lamp_type", "xml_field_name"=>"LampType"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:Lum) do
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

	def fixture_type_enums
		[
			'RecessedWithLens',
			'RecessedOrDownlight',
			'NotInCeiling'
		]
	end

	def lamp_type_enums
		[
			'LinearFluorescent',
			'CFL',
			'Incandescent',
			'LED',
			'MetalHalide',
			'MercuryVapor',
			'HighPressureSodium'
		]
	end
end