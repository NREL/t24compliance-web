json.array!(@water_heaters) do |water_heater|
  json.extract! water_heater, :id, :name, :status, :type, :count, :fluid_segment_out_reference, :fluid_segment_makeup_reference, :storage_capacity, :ef, :recovery_efficiency, :thermal_efficiency, :hir_f_plr_curve_reference, :fuel_source, :off_cycle_fuel_source, :off_cycle_parasitic_losses, :on_cycle_fuel_source, :on_cycle_parasitic_losses, :tank_off_cycle_loss_coef, :capacity_rated, :minimum_capacity, :standby_loss_fraction, :electrical_ignition, :draft_fan_power
  json.url water_heater_url(water_heater, format: :json)
end
