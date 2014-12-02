json.array!(@recirculation_dhw_systems) do |recirculation_dhw_system|
  json.extract! recirculation_dhw_system, :id, :name, :status, :type, :multiplier, :central_system, :distribution_type, :pump_power, :pump_efficiency, :system_story_count, :living_unit_count, :water_heater_count, :total_input_rating, :total_tank_volume, :baseline_recirculation_water_heater_reference, :use_default_loops, :pipe_length, :pipe_diameter, :pipe_location, :loop_count, :pipe_extra_insulation, :annual_solar_fraction
  json.url recirculation_dhw_system_url(recirculation_dhw_system, format: :json)
end
