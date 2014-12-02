json.array!(@curve_quadratics) do |curve_quadratic|
  json.extract! curve_quadratic, :id, :name, :curve_coefficient1, :curve_coefficient2, :curve_coefficient3, :curve_maximum_out, :curve_maximum_var1, :curve_minimum_out, :curve_minimum_var1
  json.url curve_quadratic_url(curve_quadratic, format: :json)
end
