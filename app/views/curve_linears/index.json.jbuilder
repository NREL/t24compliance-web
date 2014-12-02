json.array!(@curve_linears) do |curve_linear|
  json.extract! curve_linear, :id, :name, :curve_coefficient1, :curve_coefficient2, :curve_maximum_out, :curve_maximum_var1, :curve_minimum_out, :curve_minimum_var1
  json.url curve_linear_url(curve_linear, format: :json)
end
