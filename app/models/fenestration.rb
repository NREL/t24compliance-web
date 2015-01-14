class Fenestration
  # FENESTRATION LIBRARY
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :fenestration_type, type: String
  field :fenestration_product_type, type: String
  field :assembly_context, type: String
  field :certification_method, type: String
  field :skylight_glazing, type: String
  field :skylight_curb, type: String
  field :operable_window_configuration, type: String
  field :greenhouse_garden_window, type: Integer
  field :fenestration_framing, type: String
  field :fenestration_panes, type: String
  field :glazing_tint, type: String
  field :window_divider, type: String
  field :diffusing, type: Integer
  field :shgc, type: Float
  field :shgc_center_of_glass, type: Float
  field :u_factor, type: Float
  field :u_factor_center_of_glass, type: Float
  field :visible_transmittance, type: Float
  field :visible_transmittance_center_of_glass, type: Float

end
