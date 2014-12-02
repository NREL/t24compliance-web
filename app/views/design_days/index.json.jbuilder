json.array!(@design_days) do |design_day|
  json.extract! design_day, :id, :name, :type, :design_dry_bulb, :design_dry_bulb_range, :coincident_wet_bulb, :wind_speed, :wind_direction, :sky_clearness, :month, :month_day
  json.url design_day_url(design_day, format: :json)
end
