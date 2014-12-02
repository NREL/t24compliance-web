json.array!(@outside_air_controls) do |outside_air_control|
  json.extract! outside_air_control, :id, :name, :economizer_control_method, :economizer_integration, :economizer_high_temperature_lockout, :economizer_low_temperature_lockout, :air_segment_supply_reference, :air_segment_return_reference
  json.url outside_air_control_url(outside_air_control, format: :json)
end
