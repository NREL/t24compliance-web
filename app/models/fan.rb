class Fan
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :control_method, type: String
  field :classification, type: String
  field :centrifugal_type, type: String
  field :modeling_method, type: String
  field :flow_capacity, type: Float
  field :flow_minimum, type: Float
  field :flow_efficiency, type: Float
  field :total_static_pressure, type: Float
  field :motor_bhp, type: Float
  field :motor_hp, type: Float
  field :motor_type, type: String
  field :motor_pole_count, type: Integer
  field :motor_efficiency, type: Float
  field :motor_position, type: String

  belongs_to :air_segment
  belongs_to :zone_system
  belongs_to :terminal_unit


  def self.children_models
    children = [

    ]
  end

  def self.xml_fields
    xml_fields = [
      {"db_field_name"=>"name", "xml_field_name"=>"Name"},
      {"db_field_name"=>"control_method", "xml_field_name"=>"CtrlMthd"},
      {"db_field_name"=>"classification", "xml_field_name"=>"Class"},
      {"db_field_name"=>"centrifugal_type", "xml_field_name"=>"CentType"},
      {"db_field_name"=>"modeling_method", "xml_field_name"=>"ModelingMthd"},
      {"db_field_name"=>"flow_capacity", "xml_field_name"=>"FlowCap"},
      {"db_field_name"=>"flow_minimum", "xml_field_name"=>"FlowMin"},
      {"db_field_name"=>"flow_efficiency", "xml_field_name"=>"FlowEff"},
      {"db_field_name"=>"total_static_pressure", "xml_field_name"=>"TotStaticPress"},
      {"db_field_name"=>"motor_bhp", "xml_field_name"=>"MtrBHP"},
      {"db_field_name"=>"motor_hp", "xml_field_name"=>"MtrHP"},
      {"db_field_name"=>"motor_type", "xml_field_name"=>"MtrType"},
      {"db_field_name"=>"motor_pole_count", "xml_field_name"=>"MtrPoleCnt"},
      {"db_field_name"=>"motor_efficiency", "xml_field_name"=>"MtrEff"},
      {"db_field_name"=>"motor_position", "xml_field_name"=>"MtrPos"}
    ]
  end

  def to_sdd_xml(xml)
    xml.send(:Fan) do
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

  def control_method_enums
    [
      'ConstantVolume',
      'VariableSpeedDrive',
      'Dampers',
      'InletVanes',
      'VariablePitchBlades',
      'TwoSpeed'
    ]
  end

  def classification_enums
    [
      'Centrifugal',
      'Axial'
    ]
  end

  def centrifugal_type_enums
    [
      'AirFoil',
      'BackwardInclined',
      'ForwardCurved'
    ]
  end

  def modeling_method_enums
    [
      'StaticPressure',
      'BrakeHorsePower',
      'PowerPerUnitFlow'
    ]
  end

  def motor_type_enums
    [
      'Open',
      'Enclosed'
    ]
  end

  def motor_position_enums
    [
      'InAirStream',
      'NotInAirStream'
    ]
  end
end