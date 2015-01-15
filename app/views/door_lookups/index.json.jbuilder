json.array!(@doors) do |door|
  json.extract! door, :id, :name, :type, :certification_method, :u_factor, :open
end
