json.array!(@simulations) do |simulation|
  json.extract! simulation, :id
  json.url simulation_url(simulation, format: :json)
  json.filename simulation.filename
  json.name simulation.filename
end
