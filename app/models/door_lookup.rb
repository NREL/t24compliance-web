class DoorLookup
  # Door LIBRARY
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :type, type: String
  field :certification_method, type: String
  field :u_factor, type: Float
  field :open, type: String
end
