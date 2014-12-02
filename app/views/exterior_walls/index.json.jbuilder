json.array!(@exterior_walls) do |exterior_wall|
  json.extract! exterior_wall, :id, :name, :status, :construct_assembly_reference, :area, :display_perimeter, :azimuth, :exterior_solar_absorptance, :exterior_thermal_absorptance, :exterior_visible_absorptance, :interior_solar_absorptance, :interior_thermal_absorptance, :interior_visible_absorptance
  json.url exterior_wall_url(exterior_wall, format: :json)
end
