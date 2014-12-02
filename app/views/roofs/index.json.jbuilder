json.array!(@roofs) do |roof|
  json.extract! roof, :id, :name, :status, :construct_assembly_reference, :area, :azimuth, :tilt, :interior_solar_absorptance, :interior_thermal_absorptance, :interior_visible_absorptance, :field_applied_coating, :crrc_initial_reflectance, :crrc_aged_reflectance, :crrc_initial_emittance, :crrc_aged_emittance, :crrc_initial_sri, :crrc_aged_sri, :crrc_product_id
  json.url roof_url(roof, format: :json)
end
