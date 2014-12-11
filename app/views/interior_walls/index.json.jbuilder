json.array!(@interior_walls) do |interior_wall|
  json.extract! interior_wall, :id, :name, :status, :adjacent_space_reference, :construct_assembly_reference, :area
  json.url interior_wall_url(interior_wall, format: :json)
end
