class ZipCodes
  # ZIP CODE LIBRARY
  include Mongoid::Document
  include Mongoid::Timestamps

  field :state, type: String
  field :zips, type: Array
end
