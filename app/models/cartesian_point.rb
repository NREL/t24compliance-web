class CartesianPoint
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :coordinate, type: Array

  belongs_to :poly_loop


  def self.children_models
    children = [

    ]
  end

  def self.xml_fields
    xml_fields = [
      {"db_field_name"=>"name", "xml_field_name"=>"Name"},
      {"db_field_name"=>"coordinate", "xml_field_name"=>"Coord"}
    ]
  end

  def to_sdd_xml(xml)
    xml.send(:CartesianPt) do
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