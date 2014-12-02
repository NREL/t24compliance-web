json.array!(@underground_walls) do |underground_wall|
  json.extract! underground_wall, :id, :name, :status, :construct_assembly_reference, :area, :height, :interior_solar_absorptance, :interior_thermal_absorptance, :interior_visible_absorptance
  json.url underground_wall_url(underground_wall, format: :json)
end
