json.array!(@simulations) do |simulation|
  json.extract! simulation, :id, :filename, :percent_complete, :status, :cbecc_code, :cbecc_code_description, :error_messages
  json.name simulation.filename
  json.url simulation_url(simulation, format: :json)



end

