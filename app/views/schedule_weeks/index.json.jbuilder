json.array!(@schedule_weeks) do |schedule_week|
  json.extract! schedule_week, :id, :name, :type
  json.url schedule_week_url(schedule_week, format: :json)
end
