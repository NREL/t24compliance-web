class FenestrationConstruction
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :fenestration_type, type: String
  field :assembly_context, type: String

	belongs_to :project


	def children_models
		children = [

		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"fenestration_type", "xml_field_name"=>"FenType"},
			{"db_field_name"=>"assembly_context", "xml_field_name"=>"AssmContext"}
		]
	end

	def to_sdd_xml
		builder = Nokogiri::XML::Builder.new do |xml|
			xml.send(:FenCons) do
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