class OutsideAirControl
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :economizer_control_method, type: String
  field :economizer_integration, type: String
  field :economizer_high_temperature_lockout, type: Float
  field :economizer_low_temperature_lockout, type: Float
  field :air_segment_supply_reference, type: String
  field :air_segment_return_reference, type: String

  belongs_to :air_system


  def self.children_models
    children = [

    ]
  end

  def self.xml_fields
    xml_fields = [
      {"db_field_name"=>"name", "xml_field_name"=>"Name"},
      {"db_field_name"=>"economizer_control_method", "xml_field_name"=>"EconoCtrlMthd"},
      {"db_field_name"=>"economizer_integration", "xml_field_name"=>"EconoIntegration"},
      {"db_field_name"=>"economizer_high_temperature_lockout", "xml_field_name"=>"EconoHiTempLockout"},
      {"db_field_name"=>"economizer_low_temperature_lockout", "xml_field_name"=>"EconoLowTempLockout"},
      {"db_field_name"=>"air_segment_supply_reference", "xml_field_name"=>"AirSegSupRef"},
      {"db_field_name"=>"air_segment_return_reference", "xml_field_name"=>"AirSegRetRef"}
    ]
  end

  def to_sdd_xml(xml)
    xml.send(:OACtrl) do
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

  def economizer_control_method_enums
    [
      'NoEconomizer',
      'FixedDryBulb',
      'DifferentialDryBulb',
      'DifferentialEnthalpy',
      'DifferentialDryBulbAndEnthalpy'
    ]
  end

  def economizer_integration_enums
    [
      'NonIntegrated',
      'Integrated'
    ]
  end
end