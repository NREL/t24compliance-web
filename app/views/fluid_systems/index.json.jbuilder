json.array!(@fluid_systems) do |fluid_system|
  json.(fluid_system, :id, :name, :status, :type, :description, :design_supply_water_temperature, :heating_design_supply_water_temperature, :design_supply_water_temperature_delta_t, :control_type, :temperature_control, :fixed_supply_temperature, :temperature_setpoint_schedule_reference, :heating_fixed_supply_temperature, :heating_temperature_setpoint_schedule_reference, :reset_supply_high, :reset_supply_low, :reset_outdoor_high, :reset_outdoor_low, :wet_bulb_approach, :cooling_supply_temperature, :heating_supply_temperature, :evaporator_fluid_segment_in_reference, :shw_system_count, :annual_solar_fraction)
  json.fluid_segments fluid_system.fluid_segments do |seg|
    json.(seg, :id, :name, :type)
  end
  json.boilers fluid_system.boilers do |boiler|
    json.(boiler, :id, :name, :type, :fuel_source, :draft_type, :fluid_segment_in_reference, :fluid_segment_out_reference, :capacity_rated, :afue, :thermal_efficiency)
      json.pump do
        json.extract! boiler.pumps.first, :id, :name, :operation_control, :speed_control, :flow_capacity, :total_head, :motor_efficiency, :impeller_efficiency, :motor_hp
      end
  end
end
