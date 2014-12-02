json.array!(@zone_systems) do |zone_system|
  json.extract! zone_system, :id, :name, :status, :type, :description, :hvac_auto_sizing, :fan_control, :cooling_control, :count, :cooling_design_supply_air_temperature, :heating_design_supply_air_temperature, :exhaust_system_type, :exhaust_operation_mode, :exhaust_control_method, :air_distribution_type
  json.url zone_system_url(zone_system, format: :json)
end
