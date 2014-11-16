json.array!(@doors) do |door|
  json.extract! door, :id, :name, :area
  json.url door_url(door, format: :json)
end
