json.array!(@windows) do |window|
  json.extract! window, :id, :name, :status, :area
  json.url window_url(window, format: :json)
end
