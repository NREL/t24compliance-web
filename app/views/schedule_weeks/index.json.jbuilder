json.array!(@schedule_weeks) do |schedule_week|
  json.extract! schedule_week, :id, :name, :type, :schedule_day_all_days_reference, :schedule_day_weekdays_reference, :schedule_day_weekends_reference, :schedule_day_sunday_reference, :schedule_day_monday_reference, :schedule_day_tuesday_reference, :schedule_day_wednesday_reference, :schedule_day_thursday_reference, :schedule_day_friday_reference, :schedule_day_saturday_reference, :schedule_day_holiday_reference, :schedule_day_cooling_design_day_reference, :schedule_day_heating_design_day_reference
  json.url schedule_week_url(schedule_week, format: :json)
end
