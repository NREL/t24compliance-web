json.array!(@heat_rejections) do |heat_rejection|
  json.extract! heat_rejection, :id, :name, :status, :type, :fan_type, :modulation_control, :fluid_segment_in_reference, :fluid_segment_out_reference, :entering_temperature_design, :design_wb_temperature, :leaving_temperature_design, :cell_count, :capacity_rated, :total_fan_hp, :air_flow_capacity, :water_flow_capacity, :power_f_plr_curve_reference, :low_speed_air_flow_ratio, :low_speed_power_ratio, :minimum_speed_ratio
  json.url heat_rejection_url(heat_rejection, format: :json)
end
