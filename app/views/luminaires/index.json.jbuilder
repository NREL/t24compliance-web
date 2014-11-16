json.array!(@luminaires) do |luminaire|
  json.extract! luminaire, :id, :name, :fixture_type, :lamp_type
  json.url luminaire_url(luminaire, format: :json)
end
