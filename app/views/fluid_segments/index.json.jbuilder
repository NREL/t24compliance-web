json.array!(@fluid_segments) do |fluid_segment|
  json.extract! fluid_segment, :id, :name, :type, :source
  json.url fluid_segment_url(fluid_segment, format: :json)
end
