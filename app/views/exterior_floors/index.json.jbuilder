json.array!(@exterior_floors) do |exterior_floor|
  json.extract! exterior_floor, :id, :name, :status, :construct_assembly_reference, :area, :exterior_solar_absorptance, :exterior_thermal_absorptance, :exterior_visible_absorptance, :interior_solar_absorptance, :interior_thermal_absorptance, :interior_visible_absorptance
  json.url exterior_floor_url(exterior_floor, format: :json)
end
