json.array!(@curve_cubics) do |curve_cubic|
  json.extract! curve_cubic, :id, :name, :curve_coefficient1, :curve_coefficient2, :curve_coefficient3, :curve_coefficient4, :curve_maximum_out, :curve_maximum_var1, :curve_minimum_out, :curve_minimum_var1
  json.url curve_cubic_url(curve_cubic, format: :json)
end
