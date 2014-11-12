class Building
  include Mongoid::Document
	include Mongoid::Timestamps

  field :name, type: String,
  field :function_classification_method, type: String,
  field :relocatable_public_school_building, type: Integer,
  field :building_azimuth, type: Float,
  field :total_story_count, type: Integer,
  field :above_grade_story_count, type: Integer,
  field :living_unit_count, type: Integer,
  field :total_floor_area, type: Float,
  field :nonresidential_floor_area, type: Float,
  field :residential_floor_area, type: Float,
  field :total_conditioned_volume, type: Float,
  field :plant_cooling_capacity, type: Float,
  field :plant_heating_capacity, type: Float,
  field :coil_cooling_capacity, type: Float,
  field :coil_heating_capacity, type: Float
end