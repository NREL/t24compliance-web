json.array!(@luminaires) do |luminaire|
  json.extract! luminaire, :id, :name, :fixture_type, :lamp_type, :power, :heat_gain_space_fraction, :heat_gain_radiant_fraction
  json.url luminaire_url(luminaire, format: :json)
end
