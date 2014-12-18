class Fenestration
  # FENESTRATION LIBRARY
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :certification_method, type: String
  field :u_factor, type: Float
  field :solar_heat_gain_coefficient, type: Float
  field :visible_transmittance, type: Float
  field :type, type: String
  field :number_of_panes, type: Integer
  field :frame_type, type: String
  field :divider_type, type: String
  field :tint, type: String
  field :gas_fill, type: String
  field :low_emissivity_coating, type: String


end
