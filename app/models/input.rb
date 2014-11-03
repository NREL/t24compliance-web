class Input
  include Mongoid::Document

  field :name, type: String  #abbreviation
  field :display_name, type: String
  field :parents, type: Array
  field :children, type: Array
  field :notes, type: String  # catch-all

end
