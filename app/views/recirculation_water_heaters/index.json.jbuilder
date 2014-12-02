json.array!(@recirculation_water_heaters) do |recirculation_water_heater|
  json.extract! recirculation_water_heater, :id, :name, :status, :element_type, :tank_category, :tank_type, :input_rating, :energy_factor, :tank_volume, :tank_interior_insulation_r_value, :tank_exterior_insulation_r_value, :ambient_condition, :standby_loss_fraction, :thermal_efficiency
  json.url recirculation_water_heater_url(recirculation_water_heater, format: :json)
end
