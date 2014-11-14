json.array!(@construct_assemblies) do |construct_assembly|
  json.extract! construct_assembly, :id, :name, :compatible_surface_type, :material_reference
  json.url construct_assembly_url(construct_assembly, format: :json)
end
