json.array!(@holidays) do |holiday|
  json.extract! holiday, :id, :name, :specification_method, :day_of_week, :month, :day
  json.url holiday_url(holiday, format: :json)
end
