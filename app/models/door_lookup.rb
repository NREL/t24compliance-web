# This is a new model designed to hold the construction library for doors. This model is not used
# in the CBECC Com XML format. Upon XML export the generate_constructions method on Project looks up
# the constructions and saves them to XML.

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
