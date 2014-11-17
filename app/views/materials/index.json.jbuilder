json.array!(@materials) do |material|
  json.extract! material, :id, :name, :code_category, :code_item, :framing_material, :framing_configuration, :framing_depth, :cavity_insulation, :header_insulation, :cmu_weight, :cmu_fill, :spandrel_panel_insulation, :insulation_outside_waterproof_membrane
  json.url material_url(material, format: :json)
end
