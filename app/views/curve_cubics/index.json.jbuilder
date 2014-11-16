json.array!(@curve_cubics) do |curve_cubic|
  json.extract! curve_cubic, :id, :name
  json.url curve_cubic_url(curve_cubic, format: :json)
end
