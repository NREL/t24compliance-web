json.array!(@boilers) do |boiler|
  json.extract! boiler, :id, :name, :status, :type, :fuel_source, :draft_type, :fluid_segment_in_reference, :fluid_segment_out_reference, :has_bypass, :entering_temperature_design, :leaving_temperature_design, :capacity_rated, :afue, :combustion_efficiency, :thermal_efficiency, :hir_f_plr_curve_reference, :eir, :fuel_full_load, :heat_loss, :unload_ratio_minimum, :draft_fan_horse_power, :parasitic_load, :water_flow_capacity
  json.url boiler_url(boiler, format: :json)
end
