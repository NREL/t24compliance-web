class EvaporativeCooler
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :type, type: String
  field :effectiveness, type: Float
  field :pump_power, type: Float
  field :indirect_dew_point_effectiveness, type: Float
  field :secondary_fan_flow_capacity, type: Float
  field :secondary_fan_total_efficiency, type: Float
  field :secondary_fan_total_static_pressure, type: Float
  field :secondary_air_source, type: String

  belongs_to :air_segment


  def self.children_models
    children = [

    ]
  end

  def self.xml_fields
    xml_fields = [
      {"db_field_name"=>"name", "xml_field_name"=>"Name"},
      {"db_field_name"=>"type", "xml_field_name"=>"Type"},
      {"db_field_name"=>"effectiveness", "xml_field_name"=>"Eff"},
      {"db_field_name"=>"pump_power", "xml_field_name"=>"PumpPwr"},
      {"db_field_name"=>"indirect_dew_point_effectiveness", "xml_field_name"=>"IndirectDewPtEff"},
      {"db_field_name"=>"secondary_fan_flow_capacity", "xml_field_name"=>"SecFanFlowCap"},
      {"db_field_name"=>"secondary_fan_total_efficiency", "xml_field_name"=>"SecFanTotEff"},
      {"db_field_name"=>"secondary_fan_total_static_pressure", "xml_field_name"=>"SecFanTotStaticPress"},
      {"db_field_name"=>"secondary_air_source", "xml_field_name"=>"SecAirSrc"}
    ]
  end

  def to_sdd_xml(xml)
    xml.send(:EvapClr) do
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
      'Direct',
      'Indirect'
    ]
  end

  def secondary_air_source_enums
    [
      'Return',
      'Outdoor'
    ]
  end
end