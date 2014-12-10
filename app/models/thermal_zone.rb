class ThermalZone
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :type, type: String
  field :multiplier, type: Integer
  field :description, type: String
  field :supply_plenum_zone_reference, type: String
  field :return_plenum_zone_reference, type: String
  field :hvac_zone_count, type: Integer
  field :primary_air_conditioning_system_reference, type: String
  field :ventilation_system_reference, type: String
  field :cooling_design_supply_air_temperature, type: Float
  field :cooling_design_supply_air_temperature_difference, type: Float
  field :cooling_design_sizing_factor, type: Float
  field :heating_design_supply_air_temperature, type: Float
  field :heating_design_supply_air_temperature_difference, type: Float
  field :heating_design_sizing_factor, type: Float
  field :heating_design_maximum_flow_fraction, type: Float
  field :ventilation_source, type: String
  field :ventilation_control_method, type: String
  field :ventilation_specification_method, type: String
  field :daylighting_control_lighting_fraction1, type: Float
  field :daylighting_control_lighting_fraction2, type: Float
  field :daylighting_control_type, type: String
  field :daylighting_minimum_dimming_light_fraction, type: Float
  field :daylighting_minimum_dimming_power_fraction, type: Float
  field :daylighting_number_of_control_steps, type: Float
  field :exhaust_system_reference, type: String
  field :exhaust_fan_name, type: String
  field :exhaust_flow_simulated, type: Float

  belongs_to :building


  def self.children_models
    children = [

    ]
  end

  def self.xml_fields
    xml_fields = [
      {:db_field_name=>"name", :xml_field_name=>"Name"},
      {:db_field_name=>"type", :xml_field_name=>"Type"},
      {:db_field_name=>"multiplier", :xml_field_name=>"Mult"},
      {:db_field_name=>"description", :xml_field_name=>"Desc"},
      {:db_field_name=>"supply_plenum_zone_reference", :xml_field_name=>"SupPlenumZnRef"},
      {:db_field_name=>"return_plenum_zone_reference", :xml_field_name=>"RetPlenumZnRef"},
      {:db_field_name=>"hvac_zone_count", :xml_field_name=>"HVACZnCnt"},
      {:db_field_name=>"primary_air_conditioning_system_reference", :xml_field_name=>"PriAirCondgSysRef"},
      {:db_field_name=>"ventilation_system_reference", :xml_field_name=>"VentSysRef"},
      {:db_field_name=>"cooling_design_supply_air_temperature", :xml_field_name=>"ClgDsgnSupAirTemp"},
      {:db_field_name=>"cooling_design_supply_air_temperature_difference", :xml_field_name=>"ClgDsgnSupAirTempDiff"},
      {:db_field_name=>"cooling_design_sizing_factor", :xml_field_name=>"ClgDsgnSizingFac"},
      {:db_field_name=>"heating_design_supply_air_temperature", :xml_field_name=>"HtgDsgnSupAirTemp"},
      {:db_field_name=>"heating_design_supply_air_temperature_difference", :xml_field_name=>"HtgDsgnSupAirTempDiff"},
      {:db_field_name=>"heating_design_sizing_factor", :xml_field_name=>"HtgDsgnSizingFac"},
      {:db_field_name=>"heating_design_maximum_flow_fraction", :xml_field_name=>"HtgDsgnMaxFlowFrac"},
      {:db_field_name=>"ventilation_source", :xml_field_name=>"VentSrc"},
      {:db_field_name=>"ventilation_control_method", :xml_field_name=>"VentCtrlMthd"},
      {:db_field_name=>"ventilation_specification_method", :xml_field_name=>"VentSpecMthd"},
      {:db_field_name=>"daylighting_control_lighting_fraction1", :xml_field_name=>"DayltgCtrlLtgFrac1"},
      {:db_field_name=>"daylighting_control_lighting_fraction2", :xml_field_name=>"DayltgCtrlLtgFrac2"},
      {:db_field_name=>"daylighting_control_type", :xml_field_name=>"DayltgCtrlType"},
      {:db_field_name=>"daylighting_minimum_dimming_light_fraction", :xml_field_name=>"DayltgMinDimLtgFrac"},
      {:db_field_name=>"daylighting_minimum_dimming_power_fraction", :xml_field_name=>"DayltgMinDimPwrFrac"},
      {:db_field_name=>"daylighting_number_of_control_steps", :xml_field_name=>"DayltgNumOfCtrlSteps"},
      {:db_field_name=>"exhaust_system_reference", :xml_field_name=>"ExhSysRef"},
      {:db_field_name=>"exhaust_fan_name", :xml_field_name=>"ExhFanName"},
      {:db_field_name=>"exhaust_flow_simulated", :xml_field_name=>"ExhFlowSim"}
    ]
  end


  # This method is autogenerated. Do not change directly.
  def to_sdd_xml(meta, xml)
    xml.send(meta[:xml_name]) do
      self.class.xml_fields.each do |field|
        if self[field[:db_field_name]]
          if self[field[:db_field_name]].is_a? Array
            logger.debug "Translating to XML and the object is an Array"
            self[field[:db_field_name]].each_with_index do |instance, index|
              xml.send(:"#{field[:xml_field_name]}", instance, "index" => index)
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
          models = self.send(k[:model_name].pluralize)
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
          logger.debug "Data model has an array as the field"
          # check if the hash has an array, otherwise make it an array
          if h[field[:xml_field_name]].is_a? Array
            logger.debug "XML/JSON field is already an Array"
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
                model["#{meta[:model_name]}_id"] = self.id
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
              model["#{meta[:model_name]}_id"] = self.id
              model.save!
            else
              logger.warn "Class #{klass} does not have instance method 'from_sdd_json'"
            end
          end
        end
      end
    end
  end
  
  def type_enums
    [
      'Conditioned',
      'Plenum',
      'Unconditioned'
    ]
  end

  def ventilation_source_enums
    [
      'None',
      'Forced'
    ]
  end

  def ventilation_control_method_enums
    [
      'Fixed',
      'CO2Sensors'
    ]
  end

  def ventilation_specification_method_enums
    [
      'NoVentilation',
      'Maximum',
      'Sum',
      'FlowPerPerson',
      'FlowPerArea',
      'AirChangesPerHour',
      'FlowPerZone'
    ]
  end

  def daylighting_control_type_enums
    [
      'None',
      'Continuous',
      'ContinuousPlusOff',
      'SteppedSwitching'
    ]
  end
end