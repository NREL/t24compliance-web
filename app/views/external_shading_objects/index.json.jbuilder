json.array!(@external_shading_objects) do |external_shading_object|
  json.extract! external_shading_object, :id, :name, :status
  json.url external_shading_object_url(external_shading_object, format: :json)
end
