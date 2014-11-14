json.array!(@air_systems) do |air_system|
  json.extract! air_system, :id, :name
  json.url air_system_url(air_system, format: :json)
end
