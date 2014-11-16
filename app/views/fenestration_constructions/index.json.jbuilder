json.array!(@fenestration_constructions) do |fenestration_construction|
  json.extract! fenestration_construction, :id, :name, :fenestration_type, :assembly_context
  json.url fenestration_construction_url(fenestration_construction, format: :json)
end
