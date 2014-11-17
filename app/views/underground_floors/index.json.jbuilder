json.array!(@underground_floors) do |underground_floor|
  json.extract! underground_floor, :id, :name, :status, :construct_assembly_reference, :area
  json.url underground_floor_url(underground_floor, format: :json)
end
