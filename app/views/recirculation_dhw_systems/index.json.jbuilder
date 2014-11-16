json.array!(@recirculation_dhw_systems) do |recirculation_dhw_system|
  json.extract! recirculation_dhw_system, :id, :name, :status, :type
  json.url recirculation_dhw_system_url(recirculation_dhw_system, format: :json)
end
