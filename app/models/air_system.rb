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
    has_many :air_segments, dependent: :destroy, autosave: true
    has_many :terminal_units, dependent: :destroy, autosave: true
    has_many :outside_air_controls, dependent: :destroy, autosave: true

    def self.children_models
      children = [
        { model_name: 'air_segment', xml_name: 'AirSeg' },
        { model_name: 'terminal_unit', xml_name: 'TrmlUnit' },
        { model_name: 'outside_air_control', xml_name: 'OACtrl' }
      ]
    end

    def self.xml_fields
      xml_fields = [
        { db_field_name: 'name', xml_field_name: 'Name' },
        { db_field_name: 'status', xml_field_name: 'Status' },
        { db_field_name: 'type', xml_field_name: 'Type' },
        { db_field_name: 'sub_type', xml_field_name: 'SubType' },
        { db_field_name: 'description', xml_field_name: 'Desc' },
        { db_field_name: 'control_system_type', xml_field_name: 'CtrlSysType' },
        { db_field_name: 'control_zone_reference', xml_field_name: 'CtrlZnRef' },
        { db_field_name: 'night_cycle_fan_control', xml_field_name: 'NightCycleFanCtrl' },
        { db_field_name: 'reheat_control_method', xml_field_name: 'ReheatCtrlMthd' },
        { db_field_name: 'count', xml_field_name: 'Cnt' },
        { db_field_name: 'fan_position', xml_field_name: 'FanPos' },
        { db_field_name: 'cooling_design_supply_air_temperature', xml_field_name: 'ClgDsgnSupAirTemp' },
        { db_field_name: 'heating_design_supply_air_temperature', xml_field_name: 'HtgDsgnSupAirTemp' },
        { db_field_name: 'design_air_flow_minimum', xml_field_name: 'DsgnAirFlowMin' },
        { db_field_name: 'design_preheat_temperature', xml_field_name: 'DsgnPrehtTemp' },
        { db_field_name: 'design_preheat_humidity_ratio', xml_field_name: 'DsgnPrehtHumidityRat' },
        { db_field_name: 'design_precool_temperature', xml_field_name: 'DsgnPreclTemp' },
        { db_field_name: 'design_precool_humidity_ratio', xml_field_name: 'DsgnPreclHumidityRat' },
        { db_field_name: 'sizing_option', xml_field_name: 'SizingOption' },
        { db_field_name: 'cooling_all_outside_air', xml_field_name: 'ClgAllOutsdAir' },
        { db_field_name: 'heating_all_outside_air', xml_field_name: 'HtgAllOutsdAir' },
        { db_field_name: 'cooling_design_humidity_ratio', xml_field_name: 'ClgDsgnHumidityRat' },
        { db_field_name: 'heating_design_humidity_ratio', xml_field_name: 'HtgDsgnHumidityRat' },
        { db_field_name: 'cooling_control', xml_field_name: 'ClgCtrl' },
        { db_field_name: 'cooling_fixed_supply_temperature', xml_field_name: 'ClgFixedSupTemp' },
        { db_field_name: 'cooling_setpoint_schedule_reference', xml_field_name: 'ClgSetptSchRef' },
        { db_field_name: 'cool_reset_supply_high', xml_field_name: 'ClRstSupHi' },
        { db_field_name: 'cool_reset_supply_low', xml_field_name: 'ClRstSupLow' },
        { db_field_name: 'cool_reset_outdoor_low', xml_field_name: 'ClRstOutdrLow' },
        { db_field_name: 'cool_reset_outdoor_high', xml_field_name: 'ClRstOutdrHi' },
        { db_field_name: 'exhaust_system_type', xml_field_name: 'ExhSysType' },
        { db_field_name: 'exhaust_operation_mode', xml_field_name: 'ExhOperMode' },
        { db_field_name: 'exhaust_control_method', xml_field_name: 'ExhCtrlMthd' },
        { db_field_name: 'air_distribution_type', xml_field_name: 'AirDistType' }
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

    def status_enums
      %w(New Existing Altered)
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
      %w(SinglePackage SplitSystem CRAC CRAH)
    end

    def control_system_type_enums
      %w(DDCToZone Other)
    end

    def night_cycle_fan_control_enums
      %w(StaysOff CycleOnCallPrimaryZone CycleOnCallAnyZone CycleZoneFansOnly)
    end

    def reheat_control_method_enums
      %w(SingleMaximum DualMaximum)
    end

    def fan_position_enums
      %w(DrawThrough BlowThrough)
    end

    def sizing_option_enums
      %w(Coincident NonCoincident)
    end

    def cooling_all_outside_air_enums
      %w(Yes No)
    end

    def heating_all_outside_air_enums
      %w(Yes No)
    end

    def cooling_control_enums
      %w(NoSATControl Fixed Scheduled OutsideAirReset WarmestResetFlowFirst WarmestResetTemperatureFirst WarmestReset)
    end

    def exhaust_system_type_enums
      %w(General Laboratory CommercialKitchen ParkingGarage)
    end

    def exhaust_operation_mode_enums
      %w(DecoupledFromSystem CoupledToSystem)
    end

    def exhaust_control_method_enums
      %w(ConstantFlowConstantSpeedFan VariableFlowConstantSpeedFan VariableFlowVariableSpeedFan NoCOControl COControl)
    end

    def air_distribution_type_enums
      %w(Mixing UnderFloorAirDistribution DisplacementVentilation None)
    end
end
