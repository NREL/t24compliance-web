json.array!(@schedules) do |schedule|
  json.extract! schedule, :id, :name, :type, :end_month, :end_day, :schedule_week_reference
  json.url schedule_url(schedule, format: :json)
end
