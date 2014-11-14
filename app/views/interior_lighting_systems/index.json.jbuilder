json.array!(@interior_lighting_systems) do |interior_lighting_system|
  json.extract! interior_lighting_system, :id, :name, :status, :parent_space_function
  json.url interior_lighting_system_url(interior_lighting_system, format: :json)
end
