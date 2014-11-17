json.array!(@exterior_walls) do |exterior_wall|
  json.extract! exterior_wall, :id, :name, :status, :construct_assembly_reference, :area, :azimuth
  json.url exterior_wall_url(exterior_wall, format: :json)
end
