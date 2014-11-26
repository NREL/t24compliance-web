class Test
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :zip_code, type: Integer

end