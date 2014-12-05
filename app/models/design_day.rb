class DesignDay
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :type, type: String
  field :design_dry_bulb, type: Float
  field :design_dry_bulb_range, type: Float
  field :coincident_wet_bulb, type: Float
  field :wind_speed, type: Float
  field :wind_direction, type: Float
  field :sky_clearness, type: Float
  field :month, type: Integer
  field :month_day, type: Integer



  def self.children_models
    children = [

    ]
  end

  def self.xml_fields
    xml_fields = [
      {"db_field_name"=>"name", "xml_field_name"=>"Name"},
      {"db_field_name"=>"type", "xml_field_name"=>"Type"},
      {"db_field_name"=>"design_dry_bulb", "xml_field_name"=>"DsgnDB"},
      {"db_field_name"=>"design_dry_bulb_range", "xml_field_name"=>"DsgnDBRng"},
      {"db_field_name"=>"coincident_wet_bulb", "xml_field_name"=>"CoinWB"},
      {"db_field_name"=>"wind_speed", "xml_field_name"=>"WindSpd"},
      {"db_field_name"=>"wind_direction", "xml_field_name"=>"WindDirection"},
      {"db_field_name"=>"sky_clearness", "xml_field_name"=>"SkyClear"},
      {"db_field_name"=>"month", "xml_field_name"=>"Month"},
      {"db_field_name"=>"month_day", "xml_field_name"=>"Day"}
    ]
  end

  def to_sdd_xml(xml)
    xml.send(:DesignDay) do
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
      'Cooling',
      'Heating'
    ]
  end
end