class Building
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :function_classification_method, type: String
  field :relocatable_public_school_building, type: Integer
  field :whole_building_modeled, type: Integer
  field :building_azimuth, type: Float
  field :total_story_count, type: Integer
  field :total_story_count_new, type: Integer
  field :total_story_count_existing, type: Integer
  field :total_story_count_altered, type: Integer
  field :above_grade_story_count, type: Integer
  field :above_grade_story_count_new, type: Integer
  field :above_grade_story_count_existing, type: Integer
  field :above_grade_story_count_altered, type: Integer
  field :living_unit_count, type: Integer
  field :living_unit_count_new, type: Integer
  field :living_unit_count_existing, type: Integer
  field :living_unit_count_altered, type: Integer
  field :total_floor_area, type: Float
  field :nonresidential_floor_area, type: Float
  field :residential_floor_area, type: Float
  field :total_conditioned_volume, type: Float
  field :plant_cooling_capacity, type: Float
  field :plant_heating_capacity, type: Float
  field :coil_cooling_capacity, type: Float
  field :coil_heating_capacity, type: Float
  field :nonresidential_story_count_fossil_heat, type: Integer
  field :residential_story_count_fossil_heat, type: Integer
  field :nonresidential_story_count_electric_heat, type: Integer
  field :residential_story_count_electric_heat, type: Integer

  has_many :building_stories, dependent: :destroy, autosave: true
  has_many :external_shading_objects, dependent: :destroy
  has_many :thermal_zones, dependent: :destroy, autosave: true
  has_many :air_systems, dependent: :destroy, autosave: true
  has_many :zone_systems, dependent: :destroy, autosave: true
  belongs_to :project
  belongs_to :user

  # Validation
  validates_presence_of :name
  # validates_presence_of :building_azimuth
  # validates_numericality_of :building_azimuth
  validates_presence_of :total_story_count
  validates_presence_of :above_grade_story_count
  validates_numericality_of :total_story_count, only_integer: true, greater_than: 0
  validates_numericality_of :above_grade_story_count, only_integer: true
  validates_numericality_of :total_floor_area, allow_nil: true
  validates_numericality_of :living_unit_count, only_integer: true, allow_nil: true

  # validates_presence_of :whole_building_modeled

  def self.children_models
    children = [
      { model_name: 'building_story', xml_name: 'Story' },
      { model_name: 'external_shading_object', xml_name: 'ExtShdgObj' },
      { model_name: 'thermal_zone', xml_name: 'ThrmlZn' },
      { model_name: 'air_system', xml_name: 'AirSys' },
      { model_name: 'zone_system', xml_name: 'ZnSys' }
    ]
  end

  def self.xml_fields
    xml_fields = [
      { db_field_name: 'name', xml_field_name: 'Name' },
      { db_field_name: 'function_classification_method', xml_field_name: 'FuncClassMthd' },
      { db_field_name: 'relocatable_public_school_building', xml_field_name: 'RelocPubSchoolBldg' },
      { db_field_name: 'whole_building_modeled', xml_field_name: 'WholeBldgModeled' },
      { db_field_name: 'building_azimuth', xml_field_name: 'BldgAz' },
      { db_field_name: 'total_story_count', xml_field_name: 'TotStoryCnt' },
      { db_field_name: 'total_story_count_new', xml_field_name: 'TotStoryCntNew' },
      { db_field_name: 'total_story_count_existing', xml_field_name: 'TotStoryCntExisting' },
      { db_field_name: 'total_story_count_altered', xml_field_name: 'TotStoryCntAltered' },
      { db_field_name: 'above_grade_story_count', xml_field_name: 'AboveGrdStoryCnt' },
      { db_field_name: 'above_grade_story_count_new', xml_field_name: 'AboveGrdStoryCntNew' },
      { db_field_name: 'above_grade_story_count_existing', xml_field_name: 'AboveGrdStoryCntExisting' },
      { db_field_name: 'above_grade_story_count_altered', xml_field_name: 'AboveGrdStoryCntAltered' },
      { db_field_name: 'living_unit_count', xml_field_name: 'LivingUnitCnt' },
      { db_field_name: 'living_unit_count_new', xml_field_name: 'LivingUnitCntNew' },
      { db_field_name: 'living_unit_count_existing', xml_field_name: 'LivingUnitCntExisting' },
      { db_field_name: 'living_unit_count_altered', xml_field_name: 'LivingUnitCntAltered' },
      { db_field_name: 'total_floor_area', xml_field_name: 'TotFlrArea' },
      { db_field_name: 'nonresidential_floor_area', xml_field_name: 'NonResFlrArea' },
      { db_field_name: 'residential_floor_area', xml_field_name: 'ResFlrArea' },
      { db_field_name: 'total_conditioned_volume', xml_field_name: 'TotCondVol' },
      { db_field_name: 'plant_cooling_capacity', xml_field_name: 'PlantClgCap' },
      { db_field_name: 'plant_heating_capacity', xml_field_name: 'PlantHtgCap' },
      { db_field_name: 'coil_cooling_capacity', xml_field_name: 'CoilClgCap' },
      { db_field_name: 'coil_heating_capacity', xml_field_name: 'CoilHtgCap' },
      { db_field_name: 'nonresidential_story_count_fossil_heat', xml_field_name: 'NonResStoryCntFossilHt' },
      { db_field_name: 'residential_story_count_fossil_heat', xml_field_name: 'NonResStoryCntElecHt' },
      { db_field_name: 'nonresidential_story_count_electric_heat', xml_field_name: 'ResStoryCntFossilHt' },
      { db_field_name: 'residential_story_count_electric_heat', xml_field_name: 'ResStoryCntElecHt' }
    ]
  end

  # This method is autogenerated. Do not change directly.
  def to_sdd_xml(meta, xml)
    xml.send(meta[:xml_name]) do
      self.class.xml_fields.each do |field|
        if self[field[:db_field_name]]
          if self[field[:db_field_name]].is_a? Array
            logger.debug 'Translating to XML and the object is an Array'
            self[field[:db_field_name]].each_with_index do |instance, index|
              xml.send(:"#{field[:xml_field_name]}", instance, 'index' => index)
            end
          else
            xml.send(:"#{field[:xml_field_name]}", self[field[:db_field_name]])
          end
        end
      end

      # go through children if they have something to add, call their methods
      kids = self.class.children_models
      unless kids.nil? || kids.empty?
        kids.each do |k|
          models = send(k[:model_name].pluralize)
          models.each do |m|
            m.to_sdd_xml(k, xml)
          end
        end
      end
    end
  end

  # This method is autogenerated. Do not change directly.
  # Take the map of model name and xml name, and the hash (from the XML).
  def self.from_sdd_json(meta, h)
    o = nil
    if meta && h
      self_model = meta[:model_name].camelcase(:upper).constantize
      o = self_model.create_from_sdd_json(meta, h)
      if o
        o.create_children_from_sdd_json(meta, h)
        o.save!
        o.reload # in case of relationships being updated
      else
        fail "Could not create instance of #{self_model} for #{meta[:model_name]}"
      end
    end

    o
  end

  # This method is autogenerated. Do not change directly.
  def self.create_from_sdd_json(meta, h)
    new_h = {}

    # Find fields as defined by the XML
    self_model = meta[:model_name].camelcase(:upper).constantize
    self_model.xml_fields.each do |field|
      if h[field[:xml_field_name]]
        logger.debug "Field Data Type: #{self_model.fields[field[:db_field_name]].options[:type]}"
        if self_model.fields[field[:db_field_name]].options[:type].to_s == 'Array'
          logger.debug 'Data model has an array as the field'
          # check if the hash has an array, otherwise make it an array
          if h[field[:xml_field_name]].is_a? Array
            logger.debug 'XML/JSON field is already an Array'
            new_h[field[:db_field_name]] = h[field[:xml_field_name]]
          else
            new_h[field[:db_field_name]] = [h[field[:xml_field_name]]]
          end
        else
          new_h[field[:db_field_name]] = h[field[:xml_field_name]]
        end
      end
    end

    # new_h can be empty if the xml has no fields, but still create the object
    o = self_model.new(new_h)

    o
  end

  # This method is autogenerated. Do not change directly.
  def create_children_from_sdd_json(meta, h)
    # Go through the children
    self_model = meta[:model_name].camelcase(:upper).constantize
    kids = self_model.children_models
    unless kids.nil? || kids.empty?
      kids.each do |k|
        # check if the kids have a json object at this level
        if h[k[:xml_name]]
          logger.debug "XML child is #{k[:xml_name]}"
          logger.debug "Model name is #{k[:model_name]}"
          if h[k[:xml_name]].is_a? Array
            logger.debug "#{k[:xml_name]} is an array, will add all the objects"
            h[k[:xml_name]].each do |h_instance|
              klass = k[:model_name].camelcase(:upper).constantize
              if klass.respond_to? :from_sdd_json
                model = klass.from_sdd_json(k, h_instance)

                # Assign the foreign key on the object
                model["#{meta[:model_name]}_id"] = id
                model.save!
              else
                logger.warn "Class #{klass} does not have instance method 'from_sdd_json'"
              end
            end
          elsif h[k[:xml_name]].is_a? Hash
            logger.debug "#{k[:xml_name]} is a single object, will add only one"
            klass = k[:model_name].camelcase(:upper).constantize
            if klass.respond_to? :from_sdd_json
              model = klass.from_sdd_json(k, h[k[:xml_name]])

              # Assign the foreign key on the object
              model["#{meta[:model_name]}_id"] = id
              model.save!
            else
              logger.warn "Class #{klass} does not have instance method 'from_sdd_json'"
            end
          end
        end
      end
    end
  end

  def function_classification_method_enums
    [
      'AreaCategoryMethod'
    ]
  end

  def building_spaces
    spaces = []
    stories = building_stories
    stories.each do |story|
      spaces += story.spaces
    end
    return spaces
  end
end
