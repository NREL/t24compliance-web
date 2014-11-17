json.array!(@roofs) do |roof|
  json.extract! roof, :id, :name, :status, :construct_assembly_reference, :area, :azimuth
  json.url roof_url(roof, format: :json)
end
