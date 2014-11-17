json.array!(@ceilings) do |ceiling|
  json.extract! ceiling, :id, :name, :area, :adjacent_space_reference, :construct_assembly_reference
  json.url ceiling_url(ceiling, format: :json)
end
