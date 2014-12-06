class Luminaire
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :fixture_type, type: String
  field :lamp_type, type: String
  field :power, type: Float
  field :heat_gain_space_fraction, type: Float
  field :heat_gain_radiant_fraction, type: Float

  belongs_to :project


  def self.children_models
    children = [

    ]
  end

  def self.xml_fields
    xml_fields = [
      {"db_field_name"=>"name", "xml_field_name"=>"Name"},
      {"db_field_name"=>"fixture_type", "xml_field_name"=>"FxtrType"},
      {"db_field_name"=>"lamp_type", "xml_field_name"=>"LampType"},
      {"db_field_name"=>"power", "xml_field_name"=>"Pwr"},
      {"db_field_name"=>"heat_gain_space_fraction", "xml_field_name"=>"HtGnSpcFrac"},
      {"db_field_name"=>"heat_gain_radiant_fraction", "xml_field_name"=>"HtGnRadFrac"}
    ]
  end

  def to_sdd_xml(xml)
    xml.send(:Lum) do
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

  def fixture_type_enums
    [
      'RecessedWithLens',
      'RecessedOrDownlight',
      'NotInCeiling'
    ]
  end

  def lamp_type_enums
    [
      'LinearFluorescent',
      'CFL',
      'Incandescent',
      'LED',
      'MetalHalide',
      'MercuryVapor',
      'HighPressureSodium'
    ]
  end
end