json.array!(@zone_systems) do |zone_system|
  json.extract! zone_system, :id, :name, :status, :type
  json.url zone_system_url(zone_system, format: :json)
end
