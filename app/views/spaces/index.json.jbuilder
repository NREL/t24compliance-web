json.array!(@spaces) do |space|
  json.extract! space, :id, :name, :status, :floor_area, :space_function
  json.url space_url(space, format: :json)
end
