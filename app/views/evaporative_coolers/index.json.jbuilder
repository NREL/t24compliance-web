json.array!(@evaporative_coolers) do |evaporative_cooler|
  json.extract! evaporative_cooler, :id, :name, :type, :effectiveness, :pump_power, :indirect_dew_point_effectiveness, :secondary_fan_flow_capacity, :secondary_fan_total_efficiency, :secondary_fan_total_static_pressure, :secondary_air_source
  json.url evaporative_cooler_url(evaporative_cooler, format: :json)
end
