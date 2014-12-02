json.array!(@external_shading_objects) do |external_shading_object|
  json.extract! external_shading_object, :id, :name, :status, :transmittance_schedule_reference, :solar_reflectance, :visible_reflectance
  json.url external_shading_object_url(external_shading_object, format: :json)
end
