json.array!(@materials) do |material|
  json.extract! material, :id, :name, :code_category, :code_item, :framing_material, :framing_configuration, :framing_depth, :cavity_insulation, :cavity_insulation_option, :composite_material_notes, :header_insulation, :cmu_weight, :cmu_fill, :spandrel_panel_insulation, :icces_report_number, :insulation_outside_waterproof_membrane
  json.url material_url(material, format: :json)
end
