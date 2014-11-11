json.array!(@buildings) do |building|
  json.extract! building, :id, :name, :function_classification_method, :relocatable_public_school_building, :building_azimuth, :total_story_count, :above_grade_story_count, :living_unit_count, :total_floor_area, :nonresidential_floor_area, :residential_floor_area, :total_conditioned_volume, :plant_cooling_capacity, :plant_heating_capacity, :coil_cooling_capacity, :coil_heating_capacity
  json.url building_url(building, format: :json)
end
