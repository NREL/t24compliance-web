json.array!(@zone_systems) do |zone_system|
  json.extract! zone_system, :id, :name, :status, :type, :description, :hvac_auto_sizing, :fan_control, :cooling_control, :count, :cooling_design_supply_air_temperature, :heating_design_supply_air_temperature, :exhaust_system_type, :exhaust_operation_mode, :exhaust_control_method, :air_distribution_type
  json.fan zone_system.fans[0], :id, :name, :control_method, :total_static_pressure, :flow_efficiency, :motor_hp, :motor_type, :motor_pole_count, :motor_efficiency, :motor_position
  json.coil_cooling zone_system.coil_coolings[0], :id, :name, :type, :condenser_type
  json.coil_heating zone_system.coil_heatings[0], :id, :name, :type, :fluid_segment_in_reference, :fluid_segment_out_reference
end
