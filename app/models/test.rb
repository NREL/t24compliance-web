class Test
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :zip_code, type: Integer


  validates_numericality_of :zip_code, only_integer: true
  validates_uniqueness_of :name
end