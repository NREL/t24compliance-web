json.array!(@water_heaters) do |water_heater|
  json.extract! water_heater, :id, :name, :status, :type
  json.url water_heater_url(water_heater, format: :json)
end
