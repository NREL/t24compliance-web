json.array!(@chillers) do |chiller|
  json.extract! chiller, :id, :name, :status, :type, :fuel_source, :condenser_type, :condenser_fluid_segment_in_reference, :condenser_fluid_segment_out_reference, :evaporator_fluid_segment_in_reference, :evaporator_fluid_segment_out_reference, :evaporator_has_bypass, :entering_temperature_design, :entering_temperature_rated, :leaving_temperature_design, :leaving_temperature_rated, :capacity_rated, :condenser_power_rated, :kw_per_ton, :eer, :cop, :iplv_kw_per_ton, :iplveer, :iplvcop, :unload_ratio_minimum, :part_load_ratio_minimum, :water_flow_capacity
  json.url chiller_url(chiller, format: :json)
end
