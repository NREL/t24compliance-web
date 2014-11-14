json.array!(@terminal_units) do |terminal_unit|
  json.extract! terminal_unit, :id, :name, :status, :type
  json.url terminal_unit_url(terminal_unit, format: :json)
end
