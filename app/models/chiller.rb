class Chiller
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :type, type: String
  field :fuel_source, type: String
  field :condenser_type, type: String
  field :condenser_fluid_segment_in_reference, type: String
  field :condenser_fluid_segment_out_reference, type: String
  field :evaporator_fluid_segment_in_reference, type: String
  field :evaporator_fluid_segment_out_reference, type: String
  field :evaporator_has_bypass, type: Integer
  field :entering_temperature_design, type: Float
  field :entering_temperature_rated, type: Float
  field :leaving_temperature_design, type: Float
  field :leaving_temperature_rated, type: Float
  field :capacity_rated, type: Float
  field :condenser_power_rated, type: Float
  field :kw_per_ton, type: Float
  field :eer, type: Float
  field :cop, type: Float
  field :iplv_kw_per_ton, type: Float
  field :iplveer, type: Float
  field :iplvcop, type: Float
  field :unload_ratio_minimum, type: Float
  field :part_load_ratio_minimum, type: Float
  field :water_flow_capacity, type: Float

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
      {"db_field_name"=>"status", "xml_field_name"=>"Status"},
      {"db_field_name"=>"type", "xml_field_name"=>"Type"},
      {"db_field_name"=>"fuel_source", "xml_field_name"=>"FuelSrc"},
      {"db_field_name"=>"condenser_type", "xml_field_name"=>"CndsrType"},
      {"db_field_name"=>"condenser_fluid_segment_in_reference", "xml_field_name"=>"CndsrFluidSegInRef"},
      {"db_field_name"=>"condenser_fluid_segment_out_reference", "xml_field_name"=>"CndsrFluidSegOutRef"},
      {"db_field_name"=>"evaporator_fluid_segment_in_reference", "xml_field_name"=>"EvapFluidSegInRef"},
      {"db_field_name"=>"evaporator_fluid_segment_out_reference", "xml_field_name"=>"EvapFluidSegOutRef"},
      {"db_field_name"=>"evaporator_has_bypass", "xml_field_name"=>"EvapHasBypass"},
      {"db_field_name"=>"entering_temperature_design", "xml_field_name"=>"EntTempDsgn"},
      {"db_field_name"=>"entering_temperature_rated", "xml_field_name"=>"EntTempRtd"},
      {"db_field_name"=>"leaving_temperature_design", "xml_field_name"=>"LvgTempDsgn"},
      {"db_field_name"=>"leaving_temperature_rated", "xml_field_name"=>"LvgTempRtd"},
      {"db_field_name"=>"capacity_rated", "xml_field_name"=>"CapRtd"},
      {"db_field_name"=>"condenser_power_rated", "xml_field_name"=>"CndsrPwrRtd"},
      {"db_field_name"=>"kw_per_ton", "xml_field_name"=>"KwPerTon"},
      {"db_field_name"=>"eer", "xml_field_name"=>"EER"},
      {"db_field_name"=>"cop", "xml_field_name"=>"COP"},
      {"db_field_name"=>"iplv_kw_per_ton", "xml_field_name"=>"IPLVKwPerTon"},
      {"db_field_name"=>"iplveer", "xml_field_name"=>"IPLVEER"},
      {"db_field_name"=>"iplvcop", "xml_field_name"=>"IPLVCOP"},
      {"db_field_name"=>"unload_ratio_minimum", "xml_field_name"=>"UnldRatMin"},
      {"db_field_name"=>"part_load_ratio_minimum", "xml_field_name"=>"PartLdRatMin"},
      {"db_field_name"=>"water_flow_capacity", "xml_field_name"=>"WtrFlowCap"}
    ]
  end

  def to_sdd_xml(xml)
    xml.send(:Chlr) do
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

  def type_enums
    [
      'Centrifugal',
      'Reciprocating',
      'Scroll',
      'Screw'
    ]
  end

  def fuel_source_enums
    [
      'Electric'
    ]
  end

  def condenser_type_enums
    [
      'Air',
      'Fluid'
    ]
  end
end