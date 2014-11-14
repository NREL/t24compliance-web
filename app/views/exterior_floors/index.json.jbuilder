json.array!(@exterior_floors) do |exterior_floor|
  json.extract! exterior_floor, :id, :name, :status, :area
  json.url exterior_floor_url(exterior_floor, format: :json)
end
