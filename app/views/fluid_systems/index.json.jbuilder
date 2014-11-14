json.array!(@fluid_systems) do |fluid_system|
  json.extract! fluid_system, :id, :name, :status, :type
  json.url fluid_system_url(fluid_system, format: :json)
end
