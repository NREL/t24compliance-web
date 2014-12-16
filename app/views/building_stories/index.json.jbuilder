json.array!(@building_stories) do |building_story|
  json.extract! building_story, :id, :name, :multiplier, :z, :floor_to_floor_height, :floor_to_ceiling_height, :building_id
end
