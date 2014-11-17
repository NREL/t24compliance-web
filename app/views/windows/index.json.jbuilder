json.array!(@windows) do |window|
  json.extract! window, :id, :name, :status, :fenestration_construction_reference, :area
  json.url window_url(window, format: :json)
end
