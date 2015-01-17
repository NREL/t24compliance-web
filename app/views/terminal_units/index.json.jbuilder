json.array!(@terminal_units) do |terminal_unit|
  json.extract! terminal_unit, :id, :name, :status, :type, :zone_served_reference, :count, :minimum_air_fraction_schedule_reference, :primary_air_segment_reference, :primary_air_flow_maximum, :primary_air_flow_minimum, :heating_air_flow_maximum, :reheat_control_method, :induced_air_zone_reference, :induction_ratio, :fan_power_per_flow, :parallel_box_fan_flow_fraction
  unless terminal_unit['fan'].nil?
    json.fan terminal_unit['fan'], :id, :name, :control_method, :classification, :centrifugal_type, :total_static_pressure, :flow_efficiency, :motor_bhp, :motor_hp, :motor_type, :motor_pole_count, :motor_efficiency, :motor_position, :modeling_method
  end
  unless terminal_unit['coil_heating'].nil?
    json.coil_heating terminal_unit['coil_heating'], :id, :name, :type, :fluid_segment_in_reference, :fluid_segment_out_reference, :fuel_source, :furnace_afue
  end
end
