class ConstructionDefault
  include Mongoid::Document
  include Mongoid::Timestamps

  field :exterior_wall, type: String
  field :interior_wall, type: String
  field :underground_wall, type: String
  field :roof, type: String
  field :door, type: String
  field :window, type: String
  field :skylight, type: String
  field :interior_floor, type: String
  field :exterior_floor, type: String
  field :underground_floor, type: String

  belongs_to :project

  def self.display_names
    construction_default_names = [
        {db_field_name: 'exterior_wall', display_name: 'Exterior Wall Construction'},
        {db_field_name: 'interior_wall', display_name: 'Interior Wall Construction'},
        {db_field_name: 'underground_wall', display_name: 'Underground Wall Construction'},
        {db_field_name: 'roof', display_name: 'Roof Construction'},
        {db_field_name: 'window', display_name: 'Window Construction'},
        {db_field_name: 'skylight', display_name: 'Skylight Construction'},
        {db_field_name: 'interior_floor', display_name: 'Interior Floor Construction'},
        {db_field_name: 'exterior_floor', display_name: 'Exterior Floor Construction'},
        {db_field_name: 'underground_floor', display_name: 'Underground Construction'}
    ]
  end

end
