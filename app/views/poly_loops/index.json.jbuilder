json.array!(@poly_loops) do |poly_loop|
  json.extract! poly_loop, :id, :name
  json.url poly_loop_url(poly_loop, format: :json)
end
