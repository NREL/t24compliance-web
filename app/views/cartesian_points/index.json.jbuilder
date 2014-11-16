json.array!(@cartesian_points) do |cartesian_point|
  json.extract! cartesian_point, :id, :name
  json.url cartesian_point_url(cartesian_point, format: :json)
end
