json.array!(@coil_coolings) do |coil_cooling|
  json.extract! coil_cooling, :id, :name, :type
  json.url coil_cooling_url(coil_cooling, format: :json)
end
