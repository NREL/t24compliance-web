json.array!(@chillers) do |chiller|
  json.extract! chiller, :id, :name, :type
  json.url chiller_url(chiller, format: :json)
end
