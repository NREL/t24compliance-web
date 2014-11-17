json.array!(@skylights) do |skylight|
  json.extract! skylight, :id, :name, :status, :fenestration_construction_reference, :area
  json.url skylight_url(skylight, format: :json)
end
