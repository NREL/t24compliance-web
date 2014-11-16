json.array!(@schedules) do |schedule|
  json.extract! schedule, :id, :name, :type
  json.url schedule_url(schedule, format: :json)
end
