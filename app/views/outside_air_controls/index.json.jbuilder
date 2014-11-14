json.array!(@outside_air_controls) do |outside_air_control|
  json.extract! outside_air_control, :id, :name, :economizer_control_method, :economizer_integration
  json.url outside_air_control_url(outside_air_control, format: :json)
end
