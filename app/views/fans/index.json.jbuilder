json.array!(@fans) do |fan|
  json.extract! fan, :id, :name, :control_method, :classification
  json.url fan_url(fan, format: :json)
end
