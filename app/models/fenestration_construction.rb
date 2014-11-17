class FenestrationConstruction
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :fenestration_type, type: String
  field :fenestration_product_type, type: String
  field :assembly_context, type: String
  field :certification_method, type: String
  field :shgc, type: Float
  field :u_factor, type: Float
  field :visible_transmittance, type: Float

	belongs_to :project


	def children_models
		children = [

		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"fenestration_type", "xml_field_name"=>"FenType"},
			{"db_field_name"=>"fenestration_product_type", "xml_field_name"=>"FenProdType"},
			{"db_field_name"=>"assembly_context", "xml_field_name"=>"AssmContext"},
			{"db_field_name"=>"certification_method", "xml_field_name"=>"CertificationMthd"},
			{"db_field_name"=>"shgc", "xml_field_name"=>"SHGC"},
			{"db_field_name"=>"u_factor", "xml_field_name"=>"UFactor"},
			{"db_field_name"=>"visible_transmittance", "xml_field_name"=>"VT"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:FenCons) do
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

	def fenestration_type_enums
		[
			'VerticalFenestration',
			'Skylight'
		]
	end

	def assembly_context_enums
		[
			'Manufactured',
			'FieldFabricated',
			'SiteBuilt'
		]
	end
end