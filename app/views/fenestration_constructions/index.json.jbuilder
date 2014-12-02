json.array!(@fenestration_constructions) do |fenestration_construction|
  json.extract! fenestration_construction, :id, :name, :fenestration_type, :fenestration_product_type, :assembly_context, :certification_method, :skylight_glazing, :skylight_curb, :operable_window_configuration, :greenhouse_garden_window, :fenestration_framing, :fenestration_panes, :glazing_tint, :window_divider, :diffusing, :shgc, :shgc_center_of_glass, :u_factor, :u_factor_center_of_glass, :visible_transmittance, :visible_transmittance_center_of_glass
  json.url fenestration_construction_url(fenestration_construction, format: :json)
end
