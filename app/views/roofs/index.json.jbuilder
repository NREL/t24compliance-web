json.array!(@roofs) do |roof|
  json.extract! roof, :id, :name, :status, :area
  json.url roof_url(roof, format: :json)
end
