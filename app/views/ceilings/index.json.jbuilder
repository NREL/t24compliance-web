json.array!(@ceilings) do |ceiling|
  json.extract! ceiling, :id, :name, :area
  json.url ceiling_url(ceiling, format: :json)
end
