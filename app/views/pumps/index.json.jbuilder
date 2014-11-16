json.array!(@pumps) do |pump|
  json.extract! pump, :id, :name, :status, :operation_control, :speed_control
  json.url pump_url(pump, format: :json)
end
