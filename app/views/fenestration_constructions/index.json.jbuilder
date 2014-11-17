json.array!(@fenestration_constructions) do |fenestration_construction|
  json.extract! fenestration_construction, :id, :name, :fenestration_type, :fenestration_product_type, :assembly_context, :certification_method, :shgc, :u_factor, :visible_transmittance
  json.url fenestration_construction_url(fenestration_construction, format: :json)
end
