class ConstructAssembly
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :compatible_surface_type, type: String
  field :material_reference, type: Array

	belongs_to :project


	def children_models
		children = [

		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"compatible_surface_type", "xml_field_name"=>"CompatibleSurfType"},
			{"db_field_name"=>"material_reference", "xml_field_name"=>"MatRef"}
		]
	end

	def to_sdd_xml
		builder = Nokogiri::XML::Builder.new do |xml|
			xml.send(:ConsAssm) do
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

	def compatible_surface_type_enums
		[
			'ExteriorWall',
			'Roof',
			'ExteriorFloor',
			'UndergroundWall',
			'UndergroundFloor',
			'InteriorWall',
			'Ceiling',
			'InteriorFloor'
		]
	end
end