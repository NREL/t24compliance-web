json.array!(@coil_heatings) do |coil_heating|
  json.extract! coil_heating, :id, :name, :type
  json.url coil_heating_url(coil_heating, format: :json)
end
