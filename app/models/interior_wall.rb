class InteriorWall
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :adjacent_space_reference, type: String
  field :construct_assembly_reference, type: String
  field :area, type: Float
  field :exterior_solar_absorptance, type: Float
  field :exterior_thermal_absorptance, type: Float
  field :exterior_visible_absorptance, type: Float
  field :interior_solar_absorptance, type: Float
  field :interior_thermal_absorptance, type: Float
  field :interior_visible_absorptance, type: Float

  belongs_to :space
  has_many :doors
  has_many :poly_loops


  def self.children_models
    children = [
      'door',
      'poly_loop'
    ]
  end

  def self.xml_fields
    xml_fields = [
      {"db_field_name"=>"name", "xml_field_name"=>"Name"},
      {"db_field_name"=>"status", "xml_field_name"=>"Status"},
      {"db_field_name"=>"adjacent_space_reference", "xml_field_name"=>"AdjacentSpcRef"},
      {"db_field_name"=>"construct_assembly_reference", "xml_field_name"=>"ConsAssmRef"},
      {"db_field_name"=>"area", "xml_field_name"=>"Area"},
      {"db_field_name"=>"exterior_solar_absorptance", "xml_field_name"=>"ExtSolAbs"},
      {"db_field_name"=>"exterior_thermal_absorptance", "xml_field_name"=>"ExtThrmlAbs"},
      {"db_field_name"=>"exterior_visible_absorptance", "xml_field_name"=>"ExtVisAbs"},
      {"db_field_name"=>"interior_solar_absorptance", "xml_field_name"=>"IntSolAbs"},
      {"db_field_name"=>"interior_thermal_absorptance", "xml_field_name"=>"IntThrmlAbs"},
      {"db_field_name"=>"interior_visible_absorptance", "xml_field_name"=>"IntVisAbs"}
    ]
  end

  def to_sdd_xml(xml)
    xml.send(:IntWall) do
      xml_fields.each do |field|
        xml.send(:"#{field['xml_field_name']}", self[field['db_field_name']])
      end
      # go through children if they have something to add, call their methods
      kids = self.children_models
      unless kids.nil? || kids.empty?
        kids.each do |k|
          models = self.send(k.pluralize)
          models.each do |m|
            m.to_sdd_xml(xml)
          end
        end
      end
    end
  end

  def status_enums
    [
      'New',
      'Existing',
      'Altered'
    ]
  end
end