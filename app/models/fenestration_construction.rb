class FenestrationConstruction
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :fenestration_type, type: String
  field :fenestration_product_type, type: String
  field :assembly_context, type: String
  field :certification_method, type: String
  field :skylight_glazing, type: String
  field :skylight_curb, type: String
  field :operable_window_configuration, type: String
  field :greenhouse_garden_window, type: Integer
  field :fenestration_framing, type: String
  field :fenestration_panes, type: String
  field :glazing_tint, type: String
  field :window_divider, type: String
  field :diffusing, type: Integer
  field :shgc, type: Float
  field :shgc_center_of_glass, type: Float
  field :u_factor, type: Float
  field :u_factor_center_of_glass, type: Float
  field :visible_transmittance, type: Float
  field :visible_transmittance_center_of_glass, type: Float

  belongs_to :project


  def self.children_models
    children = [

    ]
  end

  def self.xml_fields
    xml_fields = [
      {"db_field_name"=>"name", "xml_field_name"=>"Name"},
      {"db_field_name"=>"fenestration_type", "xml_field_name"=>"FenType"},
      {"db_field_name"=>"fenestration_product_type", "xml_field_name"=>"FenProdType"},
      {"db_field_name"=>"assembly_context", "xml_field_name"=>"AssmContext"},
      {"db_field_name"=>"certification_method", "xml_field_name"=>"CertificationMthd"},
      {"db_field_name"=>"skylight_glazing", "xml_field_name"=>"SkyltGlz"},
      {"db_field_name"=>"skylight_curb", "xml_field_name"=>"SkyltCurb"},
      {"db_field_name"=>"operable_window_configuration", "xml_field_name"=>"OperableWinConfiguration"},
      {"db_field_name"=>"greenhouse_garden_window", "xml_field_name"=>"GreenhouseGardenWin"},
      {"db_field_name"=>"fenestration_framing", "xml_field_name"=>"FenFrm"},
      {"db_field_name"=>"fenestration_panes", "xml_field_name"=>"FenPanes"},
      {"db_field_name"=>"glazing_tint", "xml_field_name"=>"GlzTint"},
      {"db_field_name"=>"window_divider", "xml_field_name"=>"WinDivider"},
      {"db_field_name"=>"diffusing", "xml_field_name"=>"Diffusing"},
      {"db_field_name"=>"shgc", "xml_field_name"=>"SHGC"},
      {"db_field_name"=>"shgc_center_of_glass", "xml_field_name"=>"SHGCCOG"},
      {"db_field_name"=>"u_factor", "xml_field_name"=>"UFactor"},
      {"db_field_name"=>"u_factor_center_of_glass", "xml_field_name"=>"UFactorCOG"},
      {"db_field_name"=>"visible_transmittance", "xml_field_name"=>"VT"},
      {"db_field_name"=>"visible_transmittance_center_of_glass", "xml_field_name"=>"VTCOG"}
    ]
  end

  def to_sdd_xml(xml)
    xml.send(:FenCons) do
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

  def fenestration_type_enums
    [
      'VerticalFenestration',
      'Skylight'
    ]
  end

  def assembly_context_enums
    [
      'Manufactured',
      'FieldFabricated',
      'SiteBuilt'
    ]
  end

  def operable_window_configuration_enums
    [
      '- specify -',
      'CasementAwning',
      'Sliding',
      '- n/a -'
    ]
  end

  def window_divider_enums
    [
      '- specify -',
      'TrueDividedLite',
      'DividerBtwnPanesLessThan7_16in',
      'DividerBtwnPanesGreaterThanOrEqualTo7_16in',
      '- n/a -'
    ]
  end
end