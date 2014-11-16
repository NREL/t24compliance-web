json.array!(@evaporative_coolers) do |evaporative_cooler|
  json.extract! evaporative_cooler, :id, :name, :type
  json.url evaporative_cooler_url(evaporative_cooler, format: :json)
end
