class ConstructionDefault
  include Mongoid::Document
  include Mongoid::Timestamps

  field :external_wall, type: String
  field :internal_wall, type: String
  field :roof, type: String
  field :window, type: String
  field :skylight, type: String
  field :raised_floor, type: String
  field :slab_on_grade, type: String

  belongs_to :project

  def self.display_names
    construction_default_names = [
        {db_field_name: 'external_wall', display_name: 'External Wall Construction'},
        {db_field_name: 'internal_wall', display_name: 'Internal Wall Construction'},
        {db_field_name: 'roof', display_name: 'Roof Construction'},
        {db_field_name: 'window', display_name: 'Window Construction'},
        {db_field_name: 'skylight', display_name: 'Skylight Construction'},
        {db_field_name: 'raised_floor', display_name: 'Raised Floor Construction'},
        {db_field_name: 'slab_on_grade', display_name: 'Slab-on-grade Construction'}
    ]
  end

end
