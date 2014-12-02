json.array!(@doors) do |door|
  json.extract! door, :id, :name, :status, :operation, :door_construction_reference, :area
  json.url door_url(door, format: :json)
end
