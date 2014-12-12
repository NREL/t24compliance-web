json.array!(@construct_assemblies) do |construct_assembly|
  json.extract! construct_assembly, :id, :name, :compatible_surface_type, :slab_type, :slab_insulation_orientation, :slab_insulation_thermal_resistance, :field_applied_coating, :crrc_initial_reflectance, :crrc_aged_reflectance, :crrc_initial_emittance, :crrc_aged_emittance, :crrc_initial_sri, :crrc_aged_sri, :crrc_product_id, :material_reference, :solar_reflectance_astm_certification, :thermal_emittance_astm_certification, :roof_aged_solar_reflectance, :roof_aged_thermal_emittance
  json.url construct_assembly_url(construct_assembly, format: :json)
end
