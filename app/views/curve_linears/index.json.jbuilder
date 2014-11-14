json.array!(@curve_linears) do |curve_linear|
  json.extract! curve_linear, :id, :name
  json.url curve_linear_url(curve_linear, format: :json)
end
