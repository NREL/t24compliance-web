json.array!(@underground_walls) do |underground_wall|
  json.extract! underground_wall, :id, :name, :status, :area
  json.url underground_wall_url(underground_wall, format: :json)
end
