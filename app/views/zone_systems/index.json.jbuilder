json.array!(@systems) do |system|
  if %w( PTAC FPFC Exhaust).include? system.type
    json.extract! system, :id, :name, :status, :type, :description, :hvac_auto_sizing, :fan_control, :cooling_control, :count, :cooling_design_supply_air_temperature, :heating_design_supply_air_temperature, :exhaust_system_type, :exhaust_operation_mode, :exhaust_control_method, :air_distribution_type
  else
    json.extract! system, :id, :name, :type, :sub_type, :control_zone_reference
  end
  json.fan system['fan'], :id, :name, :control_method, :classification, :centrifugal_type, :total_static_pressure, :flow_efficiency, :flow_capacity, :flow_minimum, :motor_bhp, :motor_hp, :motor_type, :motor_pole_count, :motor_efficiency, :motor_position, :modeling_method
  json.coil_cooling system['coil_cooling'], :id, :name, :type, :condenser_type, :dxeer
  json.coil_heating system['coil_heating'], :id, :name, :type, :fluid_segment_in_reference, :fluid_segment_out_reference, :fuel_source, :furnace_afue
end
