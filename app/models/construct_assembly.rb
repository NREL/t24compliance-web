class ConstructAssembly
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :compatible_surface_type, type: String
  field :exterior_solar_absorptance, type: Float
  field :exterior_thermal_absorptance, type: Float
  field :exterior_visible_absorptance, type: Float
  field :interior_solar_absorptance, type: Float
  field :interior_thermal_absorptance, type: Float
  field :interior_visible_absorptance, type: Float
  field :slab_type, type: String
  field :slab_insulation_orientation, type: String
  field :slab_insulation_thermal_resistance, type: String
  field :field_applied_coating, type: Integer
  field :crrc_initial_reflectance, type: Float
  field :crrc_aged_reflectance, type: Float
  field :crrc_initial_emittance, type: Float
  field :crrc_aged_emittance, type: Float
  field :crrc_initial_sri, type: Integer
  field :crrc_aged_sri, type: Integer
  field :crrc_product_id, type: String
  field :material_reference, type: Array

  belongs_to :project


  def self.children_models
    children = [

    ]
  end

  def self.xml_fields
    xml_fields = [
      {"db_field_name"=>"name", "xml_field_name"=>"Name"},
      {"db_field_name"=>"compatible_surface_type", "xml_field_name"=>"CompatibleSurfType"},
      {"db_field_name"=>"exterior_solar_absorptance", "xml_field_name"=>"ExtSolAbs"},
      {"db_field_name"=>"exterior_thermal_absorptance", "xml_field_name"=>"ExtThrmlAbs"},
      {"db_field_name"=>"exterior_visible_absorptance", "xml_field_name"=>"ExtVisAbs"},
      {"db_field_name"=>"interior_solar_absorptance", "xml_field_name"=>"IntSolAbs"},
      {"db_field_name"=>"interior_thermal_absorptance", "xml_field_name"=>"IntThrmlAbs"},
      {"db_field_name"=>"interior_visible_absorptance", "xml_field_name"=>"IntVisAbs"},
      {"db_field_name"=>"slab_type", "xml_field_name"=>"SlabType"},
      {"db_field_name"=>"slab_insulation_orientation", "xml_field_name"=>"SlabInsOrientation"},
      {"db_field_name"=>"slab_insulation_thermal_resistance", "xml_field_name"=>"SlabInsThrmlR"},
      {"db_field_name"=>"field_applied_coating", "xml_field_name"=>"FieldAppliedCoating"},
      {"db_field_name"=>"crrc_initial_reflectance", "xml_field_name"=>"CRRCInitialRefl"},
      {"db_field_name"=>"crrc_aged_reflectance", "xml_field_name"=>"CRRCAgedRefl"},
      {"db_field_name"=>"crrc_initial_emittance", "xml_field_name"=>"CRRCInitialEmittance"},
      {"db_field_name"=>"crrc_aged_emittance", "xml_field_name"=>"CRRCAgedEmittance"},
      {"db_field_name"=>"crrc_initial_sri", "xml_field_name"=>"CRRCInitialSRI"},
      {"db_field_name"=>"crrc_aged_sri", "xml_field_name"=>"CRRCAgedSRI"},
      {"db_field_name"=>"crrc_product_id", "xml_field_name"=>"CRRCProdID"},
      {"db_field_name"=>"material_reference", "xml_field_name"=>"MatRef"}
    ]
  end

  def to_sdd_xml(xml)
    xml.send(:ConsAssm) do
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

  def compatible_surface_type_enums
    [
      'ExteriorWall',
      'Roof',
      'ExteriorFloor',
      'UndergroundWall',
      'UndergroundFloor',
      'InteriorWall',
      'Ceiling',
      'InteriorFloor'
    ]
  end

  def slab_type_enums
    [
      '- specify -',
      'HeatedSlabOnGrade',
      'HeatedSlabBelowGrade',
      'UnheatedSlabOnGrade',
      'UnheatedSlabBelowGrade'
    ]
  end

  def slab_insulation_orientation_enums
    [
      'None',
      '12inHorizontal',
      '24inHorizontal',
      '36inHorizontal',
      '48inHorizontal',
      '12inVertical',
      '24inVertical',
      '36inVertical',
      '48inVertical',
      'FullyInsulatedSlab'
    ]
  end
end