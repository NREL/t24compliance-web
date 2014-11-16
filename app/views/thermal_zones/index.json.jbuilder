json.array!(@thermal_zones) do |thermal_zone|
  json.extract! thermal_zone, :id, :name, :type, :multiplier
  json.url thermal_zone_url(thermal_zone, format: :json)
end
