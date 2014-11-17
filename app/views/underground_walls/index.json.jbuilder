json.array!(@underground_walls) do |underground_wall|
  json.extract! underground_wall, :id, :name, :status, :construct_assembly_reference, :area, :height
  json.url underground_wall_url(underground_wall, format: :json)
end
