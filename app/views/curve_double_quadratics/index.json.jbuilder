json.array!(@curve_double_quadratics) do |curve_double_quadratic|
  json.extract! curve_double_quadratic, :id, :name
  json.url curve_double_quadratic_url(curve_double_quadratic, format: :json)
end
