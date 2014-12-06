class FluidSegment
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :type, type: String
  field :source, type: String
  field :primary_segment_reference, type: String

  belongs_to :fluid_system
  has_many :pumps


  def self.children_models
    children = [
      'pump'
    ]
  end

  def self.xml_fields
    xml_fields = [
      {"db_field_name"=>"name", "xml_field_name"=>"Name"},
      {"db_field_name"=>"type", "xml_field_name"=>"Type"},
      {"db_field_name"=>"source", "xml_field_name"=>"Src"},
      {"db_field_name"=>"primary_segment_reference", "xml_field_name"=>"PriSegRef"}
    ]
  end

  def to_sdd_xml(xml)
    xml.send(:FluidSeg) do
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

  def type_enums
    [
      '- specify -',
      'PrimarySupply',
      'PrimaryReturn',
      'SecondarySupply',
      'SecondaryReturn',
      'MakeupFluid'
    ]
  end

  def source_enums
    [
      'NoExternalSource',
      'MunicipalWater'
    ]
  end
end