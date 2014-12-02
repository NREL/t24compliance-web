json.array!(@ceilings) do |ceiling|
  json.extract! ceiling, :id, :name, :area, :adjacent_space_reference, :construct_assembly_reference, :exterior_solar_absorptance, :exterior_thermal_absorptance, :exterior_visible_absorptance, :interior_solar_absorptance, :interior_thermal_absorptance, :interior_visible_absorptance
  json.url ceiling_url(ceiling, format: :json)
end
