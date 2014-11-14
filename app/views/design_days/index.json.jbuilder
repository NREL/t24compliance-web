json.array!(@design_days) do |design_day|
  json.extract! design_day, :id, :name
  json.url design_day_url(design_day, format: :json)
end
