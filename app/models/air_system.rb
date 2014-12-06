class AirSystem
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :type, type: String
  field :sub_type, type: String
  field :description, type: String
  field :control_system_type, type: String
  field :control_zone_reference, type: String
  field :night_cycle_fan_control, type: String
  field :reheat_control_method, type: String
  field :count, type: Integer
  field :fan_position, type: String
  field :cooling_design_supply_air_temperature, type: Float
  field :heating_design_supply_air_temperature, type: Float
  field :design_air_flow_minimum, type: Float
  field :design_preheat_temperature, type: Float
  field :design_preheat_humidity_ratio, type: Float
  field :design_precool_temperature, type: Float
  field :design_precool_humidity_ratio, type: Float
  field :sizing_option, type: String
  field :cooling_all_outside_air, type: String
  field :heating_all_outside_air, type: String
  field :cooling_design_humidity_ratio, type: Float
  field :heating_design_humidity_ratio, type: Float
  field :cooling_control, type: String
  field :cooling_fixed_supply_temperature, type: Float
  field :cooling_setpoint_schedule_reference, type: String
  field :cool_reset_supply_high, type: Float
  field :cool_reset_supply_low, type: Float
  field :cool_reset_outdoor_low, type: Float
  field :cool_reset_outdoor_high, type: Float
  field :exhaust_system_type, type: String
  field :exhaust_operation_mode, type: String
  field :exhaust_control_method, type: String
  field :air_distribution_type, type: String

  belongs_to :building
  has_many :air_segments
  has_many :terminal_units
  has_many :outside_air_controls


  def self.children_models
    children = [
      'air_segment',
      'terminal_unit',
      'outside_air_control'
    ]
  end

  def self.xml_fields
    xml_fields = [
      {"db_field_name"=>"name", "xml_field_name"=>"Name"},
      {"db_field_name"=>"status", "xml_field_name"=>"Status"},
      {"db_field_name"=>"type", "xml_field_name"=>"Type"},
      {"db_field_name"=>"sub_type", "xml_field_name"=>"SubType"},
      {"db_field_name"=>"description", "xml_field_name"=>"Desc"},
      {"db_field_name"=>"control_system_type", "xml_field_name"=>"CtrlSysType"},
      {"db_field_name"=>"control_zone_reference", "xml_field_name"=>"CtrlZnRef"},
      {"db_field_name"=>"night_cycle_fan_control", "xml_field_name"=>"NightCycleFanCtrl"},
      {"db_field_name"=>"reheat_control_method", "xml_field_name"=>"ReheatCtrlMthd"},
      {"db_field_name"=>"count", "xml_field_name"=>"Cnt"},
      {"db_field_name"=>"fan_position", "xml_field_name"=>"FanPos"},
      {"db_field_name"=>"cooling_design_supply_air_temperature", "xml_field_name"=>"ClgDsgnSupAirTemp"},
      {"db_field_name"=>"heating_design_supply_air_temperature", "xml_field_name"=>"HtgDsgnSupAirTemp"},
      {"db_field_name"=>"design_air_flow_minimum", "xml_field_name"=>"DsgnAirFlowMin"},
      {"db_field_name"=>"design_preheat_temperature", "xml_field_name"=>"DsgnPrehtTemp"},
      {"db_field_name"=>"design_preheat_humidity_ratio", "xml_field_name"=>"DsgnPrehtHumidityRat"},
      {"db_field_name"=>"design_precool_temperature", "xml_field_name"=>"DsgnPreclTemp"},
      {"db_field_name"=>"design_precool_humidity_ratio", "xml_field_name"=>"DsgnPreclHumidityRat"},
      {"db_field_name"=>"sizing_option", "xml_field_name"=>"SizingOption"},
      {"db_field_name"=>"cooling_all_outside_air", "xml_field_name"=>"ClgAllOutsdAir"},
      {"db_field_name"=>"heating_all_outside_air", "xml_field_name"=>"HtgAllOutsdAir"},
      {"db_field_name"=>"cooling_design_humidity_ratio", "xml_field_name"=>"ClgDsgnHumidityRat"},
      {"db_field_name"=>"heating_design_humidity_ratio", "xml_field_name"=>"HtgDsgnHumidityRat"},
      {"db_field_name"=>"cooling_control", "xml_field_name"=>"ClgCtrl"},
      {"db_field_name"=>"cooling_fixed_supply_temperature", "xml_field_name"=>"ClgFixedSupTemp"},
      {"db_field_name"=>"cooling_setpoint_schedule_reference", "xml_field_name"=>"ClgSetptSchRef"},
      {"db_field_name"=>"cool_reset_supply_high", "xml_field_name"=>"ClRstSupHi"},
      {"db_field_name"=>"cool_reset_supply_low", "xml_field_name"=>"ClRstSupLow"},
      {"db_field_name"=>"cool_reset_outdoor_low", "xml_field_name"=>"ClRstOutdrLow"},
      {"db_field_name"=>"cool_reset_outdoor_high", "xml_field_name"=>"ClRstOutdrHi"},
      {"db_field_name"=>"exhaust_system_type", "xml_field_name"=>"ExhSysType"},
      {"db_field_name"=>"exhaust_operation_mode", "xml_field_name"=>"ExhOperMode"},
      {"db_field_name"=>"exhaust_control_method", "xml_field_name"=>"ExhCtrlMthd"},
      {"db_field_name"=>"air_distribution_type", "xml_field_name"=>"AirDistType"}
    ]
  end

  def to_sdd_xml(xml)
    xml.send(:AirSys) do
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

  def type_enums
    [
      '- specify -',
      'PVAV',
      'VAV',
      'SZAC',
      'SZHP',
      'SZVAVAC',
      'SZVAVHP',
      'HV',
      'Exhaust'
    ]
  end

  def sub_type_enums
    [
      'SinglePackage',
      'SplitSystem',
      'CRAC',
      'CRAH'
    ]
  end

  def control_system_type_enums
    [
      'DDCToZone',
      'Other'
    ]
  end

  def night_cycle_fan_control_enums
    [
      'StaysOff',
      'CycleOnCallPrimaryZone',
      'CycleOnCallAnyZone',
      'CycleZoneFansOnly'
    ]
  end

  def reheat_control_method_enums
    [
      'SingleMaximum',
      'DualMaximum'
    ]
  end

  def fan_position_enums
    [
      'DrawThrough',
      'BlowThrough'
    ]
  end

  def sizing_option_enums
    [
      'Coincident',
      'NonCoincident'
    ]
  end

  def cooling_all_outside_air_enums
    [
      'Yes',
      'No'
    ]
  end

  def heating_all_outside_air_enums
    [
      'Yes',
      'No'
    ]
  end

  def cooling_control_enums
    [
      'Fixed',
      'WarmestResetFlowFirst',
      'OutsideAirReset',
      'Scheduled',
      'NoSATControl'
    ]
  end

  def exhaust_system_type_enums
    [
      'General',
      'Laboratory',
      'CommercialKitchen',
      'ParkingGarage'
    ]
  end

  def exhaust_operation_mode_enums
    [
      'DecoupledFromSystem',
      'CoupledToSystem'
    ]
  end

  def exhaust_control_method_enums
    [
      'ConstantFlowConstantSpeedFan',
      'VariableFlowConstantSpeedFan',
      'VariableFlowVariableSpeedFan',
      'NoCOControl',
      'COControl'
    ]
  end

  def air_distribution_type_enums
    [
      'Mixing',
      'UnderFloorAirDistribution',
      'DisplacementVentilation',
      'None'
    ]
  end
end