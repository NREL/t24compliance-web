json.array!(@spaces) do |space|
  json.extract! space, :id, :name, :status, :thermal_zone_reference, :area, :space_function_defaults_reference, :space_function, :secondary_sidelit100_percent_controlled
  json.url space_url(space, format: :json)
end
