class CurveCubic
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :curve_coefficient1, type: Float
  field :curve_coefficient2, type: Float
  field :curve_coefficient3, type: Float
  field :curve_coefficient4, type: Float
  field :curve_maximum_out, type: Float
  field :curve_maximum_var1, type: Float
  field :curve_minimum_out, type: Float
  field :curve_minimum_var1, type: Float

  belongs_to :project


  def self.children_models
    children = [

    ]
  end

  def self.xml_fields
    xml_fields = [
      {"db_field_name"=>"name", "xml_field_name"=>"Name"},
      {"db_field_name"=>"curve_coefficient1", "xml_field_name"=>"Coef1"},
      {"db_field_name"=>"curve_coefficient2", "xml_field_name"=>"Coef2"},
      {"db_field_name"=>"curve_coefficient3", "xml_field_name"=>"Coef3"},
      {"db_field_name"=>"curve_coefficient4", "xml_field_name"=>"Coef4"},
      {"db_field_name"=>"curve_maximum_out", "xml_field_name"=>"MaxOut"},
      {"db_field_name"=>"curve_maximum_var1", "xml_field_name"=>"MaxVar1"},
      {"db_field_name"=>"curve_minimum_out", "xml_field_name"=>"MinOut"},
      {"db_field_name"=>"curve_minimum_var1", "xml_field_name"=>"MinVar1"}
    ]
  end

  def to_sdd_xml(xml)
    xml.send(:CrvCubic) do
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
end