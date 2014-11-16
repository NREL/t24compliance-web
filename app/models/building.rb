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
	belongs_to :project


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
			{"db_field_name"=>"function_classification_method", "xml_field_name"=>"FuncClassMthd"},
			{"db_field_name"=>"relocatable_public_school_building", "xml_field_name"=>"RelocPubSchoolBldg"},
			{"db_field_name"=>"building_azimuth", "xml_field_name"=>"BldgAz"},
			{"db_field_name"=>"total_story_count", "xml_field_name"=>"TotStoryCnt"},
			{"db_field_name"=>"above_grade_story_count", "xml_field_name"=>"AboveGrdStoryCnt"},
			{"db_field_name"=>"living_unit_count", "xml_field_name"=>"LivingUnitCnt"},
			{"db_field_name"=>"total_floor_area", "xml_field_name"=>"TotFlrArea"},
			{"db_field_name"=>"nonresidential_floor_area", "xml_field_name"=>"NonResFlrArea"},
			{"db_field_name"=>"residential_floor_area", "xml_field_name"=>"ResFlrArea"},
			{"db_field_name"=>"total_conditioned_volume", "xml_field_name"=>"TotCondVol"},
			{"db_field_name"=>"plant_cooling_capacity", "xml_field_name"=>"PlantClgCap"},
			{"db_field_name"=>"plant_heating_capacity", "xml_field_name"=>"PlantHtgCap"},
			{"db_field_name"=>"coil_cooling_capacity", "xml_field_name"=>"CoilClgCap"},
			{"db_field_name"=>"coil_heating_capacity", "xml_field_name"=>"CoilHtgCap"}
		]
	end

	def to_sdd_xml
		builder = Nokogiri::XML::Builder.new do |xml|
			xml.send(:Bldg) do
				xml_fields.each do |field|
					xml.send(:"#{field['xml_field_name']}", self[field['db_field_name']])
				end
				# go through children if they have something to add, call their methods
				kids = self.children_models
				unless kids.nil? or kids.empty?
					kids.each do |k|
						if k == 'building'
							xml << self.building.to_sdd_xml
						else
							models = self.send(k.pluralize)
							models.each do |m|
								xml << m.to_sdd_xml
							end
						end
					end
				end
			end
		end
		#builder.to_xml
	end
end