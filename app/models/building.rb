class Building
  include Mongoid::Document
	include Mongoid::Timestamps


  field :name, type: String
  field :function_classification_method, type: String
  field :relocatable_public_school_building, type: Integer
  field :building_azimuth, type: Float
  field :total_story_count, type: Integer
  field :above_grade_story_count, type: Integer
  field :living_unit_count, type: Integer
  field :total_floor_area, type: Float
  field :nonresidential_floor_area, type: Float
  field :residential_floor_area, type: Float
  field :total_conditioned_volume, type: Float
  field :plant_cooling_capacity, type: Float
  field :plant_heating_capacity, type: Float
  field :coil_cooling_capacity, type: Float
  field :coil_heating_capacity, type: Float


	has_many :building_stories
	has_many :external_shading_objects
	has_many :thermal_zones
	has_many :air_systems
	has_many :zone_systems


	def children_models
		children = [
			'building_story',
			'external_shading_object',
			'thermal_zone',
			'air_system',
			'zone_system'
		]
	end

	def xml_fields
		xml_fields = [
			'function_classification_method',
			'relocatable_public_school_building',
			'building_azimuth',
			'total_story_count',
			'above_grade_story_count',
			'living_unit_count',
			'total_floor_area',
			'nonresidential_floor_area',
			'residential_floor_area',
			'total_conditioned_volume',
			'plant_cooling_capacity',
			'plant_heating_capacity',
			'coil_cooling_capacity',
			'coil_heating_capacity'
		]
	end

	def to_sdd_xml
		builder = Nokogiri::XML::Builder.new do |xml|
			xml.send(:Bldg) do
				xml_fields.each do |field|
					xml.send(:"#{field}", self[field])
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
		builder.to_xml
	end
end