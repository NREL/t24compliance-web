json.array!(@interior_walls) do |interior_wall|
  json.extract! interior_wall, :id, :name
  json.url interior_wall_url(interior_wall, format: :json)
end
