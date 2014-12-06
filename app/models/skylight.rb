class Skylight
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :fenestration_construction_reference, type: String
  field :area, type: Float

  belongs_to :roof
  has_many :poly_loops


  def self.children_models
    children = [
      'poly_loop'
    ]
  end

  def self.xml_fields
    xml_fields = [
      {"db_field_name"=>"name", "xml_field_name"=>"Name"},
      {"db_field_name"=>"status", "xml_field_name"=>"Status"},
      {"db_field_name"=>"fenestration_construction_reference", "xml_field_name"=>"FenConsRef"},
      {"db_field_name"=>"area", "xml_field_name"=>"Area"}
    ]
  end

  def to_sdd_xml(xml)
    xml.send(:Skylt) do
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
      'Existing'
    ]
  end
end