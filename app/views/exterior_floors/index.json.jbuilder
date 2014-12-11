json.array!(@exterior_floors) do |exterior_floor|
  json.extract! exterior_floor, :id, :name, :status, :construct_assembly_reference, :area
  json.url exterior_floor_url(exterior_floor, format: :json)
end
