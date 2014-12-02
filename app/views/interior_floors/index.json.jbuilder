json.array!(@interior_floors) do |interior_floor|
  json.extract! interior_floor, :id, :name, :adjacent_space_reference, :construct_assembly_reference, :area, :interior_solar_absorptance, :interior_thermal_absorptance, :interior_visible_absorptance
  json.url interior_floor_url(interior_floor, format: :json)
end
