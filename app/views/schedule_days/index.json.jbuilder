json.array!(@schedule_days) do |schedule_day|
  json.extract! schedule_day, :id, :name, :type
  json.url schedule_day_url(schedule_day, format: :json)
end
