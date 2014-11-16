json.array!(@space_function_defaults) do |space_function_default|
  json.extract! space_function_default, :id, :name, :space_function, :function_schedule_group
  json.url space_function_default_url(space_function_default, format: :json)
end
