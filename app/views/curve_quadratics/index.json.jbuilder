json.array!(@curve_quadratics) do |curve_quadratic|
  json.extract! curve_quadratic, :id, :name
  json.url curve_quadratic_url(curve_quadratic, format: :json)
end
