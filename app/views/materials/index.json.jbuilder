json.array!(@materials) do |material|
  json.extract! material, :id, :name, :code_category, :framing_material
  json.url material_url(material, format: :json)
end
