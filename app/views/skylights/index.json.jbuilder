json.array!(@skylights) do |skylight|
  json.extract! skylight, :id, :name, :status, :area
  json.url skylight_url(skylight, format: :json)
end
