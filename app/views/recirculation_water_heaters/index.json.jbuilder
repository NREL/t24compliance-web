json.array!(@recirculation_water_heaters) do |recirculation_water_heater|
  json.extract! recirculation_water_heater, :id, :name, :status, :element_type, :tank_category
  json.url recirculation_water_heater_url(recirculation_water_heater, format: :json)
end
