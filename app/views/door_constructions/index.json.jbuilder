json.array!(@door_constructions) do |door_construction|
  json.extract! door_construction, :id, :name, :type, :certification_method, :u_factor, :open
  json.url door_construction_url(door_construction, format: :json)
end
