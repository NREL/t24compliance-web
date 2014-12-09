class SpaceFunctionDefault
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :space_function, type: String
  field :function_schedule_group, type: String
  field :occupant_density, type: Float
  field :occupant_sensible_heat_rate, type: Float
  field :occupant_latent_heat_rate, type: Float
  field :occupant_schedule_reference, type: String
  field :ventilation_per_person, type: Float
  field :ventilation_per_area, type: Float
  field :ventilation_air_changes_per_hour, type: Float
  field :exhaust_per_area, type: Float
  field :exhaust_air_changes_per_hour, type: Float
  field :interior_lighting_power_density_regulated, type: Float
  field :interior_lighting_regulated_schedule_reference, type: String
  field :interior_lighting_regulated_heat_gain_space_fraction, type: Float
  field :interior_lighting_regulated_heat_gain_radiant_fraction, type: Float
  field :interior_lighting_power_density_non_regulated, type: Float
  field :interior_lighting_non_regulated_schedule_reference, type: String
  field :interior_lighting_non_regulated_heat_gain_space_fraction, type: Float
  field :interior_lighting_non_regulated_heat_gain_radiant_fraction, type: Float
  field :receptacle_power_density, type: Float
  field :receptacle_schedule_reference, type: String
  field :receptacle_radiation_fraction, type: Float
  field :receptacle_latent_fraction, type: Float
  field :receptacle_lost_fraction, type: Float
  field :gas_equipment_power_density, type: Float
  field :gas_equipment_schedule_reference, type: String
  field :gas_equipment_radiation_fraction, type: Float
  field :gas_equipment_latent_fraction, type: Float
  field :gas_equipment_lost_fraction, type: Float
  field :process_electrical_power_density, type: Float
  field :process_electrical_schedule_reference, type: String
  field :process_electrical_radiation_fraction, type: Float
  field :process_electrical_latent_fraction, type: Float
  field :process_electrical_lost_fraction, type: Float
  field :commercial_refrigeration_epd, type: Float
  field :commercial_refrigeration_equipment_schedule_reference, type: String
  field :commercial_refrigeration_radiation_fraction, type: Float
  field :commercial_refrigeration_latent_fraction, type: Float
  field :commercial_refrigeration_lost_fraction, type: Float
  field :elevator_count, type: Integer
  field :elevator_power, type: Float
  field :elevator_schedule_reference, type: String
  field :elevator_radiation_fraction, type: Float
  field :elevator_latent_fraction, type: Float
  field :elevator_lost_fraction, type: Float
  field :escalator_count, type: Integer
  field :escalator_power, type: Float
  field :escalator_schedule_reference, type: String
  field :escalator_radiation_fraction, type: Float
  field :escalator_latent_fraction, type: Float
  field :escalator_lost_fraction, type: Float
  field :process_gas_power_density, type: Float
  field :process_gas_schedule_reference, type: String
  field :process_gas_radiation_fraction, type: Float
  field :process_gas_latent_fraction, type: Float
  field :process_gas_lost_fraction, type: Float
  field :hot_water_heating_rate, type: Float
  field :hot_water_heating_schedule_reference, type: String
  field :shw_fluid_segment_reference, type: String
  field :recirculation_dhw_system_reference, type: String
  field :infiltration_method, type: Array
  field :design_infiltration_rate, type: Array
  field :infiltration_schedule_reference, type: Array
  field :infiltration_model_coefficient_a, type: Array
  field :infiltration_model_coefficient_b, type: Array
  field :infiltration_model_coefficient_c, type: Array
  field :infiltration_model_coefficient_d, type: Array

  belongs_to :project


  def self.children_models
    children = [

    ]
  end

  def self.xml_fields
    xml_fields = [
      {:db_field_name=>"name", :xml_field_name=>"Name"},
      {:db_field_name=>"space_function", :xml_field_name=>"SpcFunc"},
      {:db_field_name=>"function_schedule_group", :xml_field_name=>"FuncSchGrp"},
      {:db_field_name=>"occupant_density", :xml_field_name=>"OccDens"},
      {:db_field_name=>"occupant_sensible_heat_rate", :xml_field_name=>"OccSensHtRt"},
      {:db_field_name=>"occupant_latent_heat_rate", :xml_field_name=>"OccLatHtRt"},
      {:db_field_name=>"occupant_schedule_reference", :xml_field_name=>"OccSchRef"},
      {:db_field_name=>"ventilation_per_person", :xml_field_name=>"VentPerPerson"},
      {:db_field_name=>"ventilation_per_area", :xml_field_name=>"VentPerArea"},
      {:db_field_name=>"ventilation_air_changes_per_hour", :xml_field_name=>"VentACH"},
      {:db_field_name=>"exhaust_per_area", :xml_field_name=>"ExhPerArea"},
      {:db_field_name=>"exhaust_air_changes_per_hour", :xml_field_name=>"ExhACH"},
      {:db_field_name=>"interior_lighting_power_density_regulated", :xml_field_name=>"IntLPDReg"},
      {:db_field_name=>"interior_lighting_regulated_schedule_reference", :xml_field_name=>"IntLtgRegSchRef"},
      {:db_field_name=>"interior_lighting_regulated_heat_gain_space_fraction", :xml_field_name=>"IntLtgRegHtGnSpcFrac"},
      {:db_field_name=>"interior_lighting_regulated_heat_gain_radiant_fraction", :xml_field_name=>"IntLtgRegHtGnRadFrac"},
      {:db_field_name=>"interior_lighting_power_density_non_regulated", :xml_field_name=>"IntLPDNonReg"},
      {:db_field_name=>"interior_lighting_non_regulated_schedule_reference", :xml_field_name=>"IntLtgNonRegSchRef"},
      {:db_field_name=>"interior_lighting_non_regulated_heat_gain_space_fraction", :xml_field_name=>"IntLtgNonRegHtGnSpcFrac"},
      {:db_field_name=>"interior_lighting_non_regulated_heat_gain_radiant_fraction", :xml_field_name=>"IntLtgNonRegHtGnRadFrac"},
      {:db_field_name=>"receptacle_power_density", :xml_field_name=>"RecptPwrDens"},
      {:db_field_name=>"receptacle_schedule_reference", :xml_field_name=>"RecptSchRef"},
      {:db_field_name=>"receptacle_radiation_fraction", :xml_field_name=>"RecptRadFrac"},
      {:db_field_name=>"receptacle_latent_fraction", :xml_field_name=>"RecptLatFrac"},
      {:db_field_name=>"receptacle_lost_fraction", :xml_field_name=>"RecptLostFrac"},
      {:db_field_name=>"gas_equipment_power_density", :xml_field_name=>"GasEqpPwrDens"},
      {:db_field_name=>"gas_equipment_schedule_reference", :xml_field_name=>"GasEqpSchRef"},
      {:db_field_name=>"gas_equipment_radiation_fraction", :xml_field_name=>"GasEqpRadFrac"},
      {:db_field_name=>"gas_equipment_latent_fraction", :xml_field_name=>"GasEqpLatFrac"},
      {:db_field_name=>"gas_equipment_lost_fraction", :xml_field_name=>"GasEqpLostFrac"},
      {:db_field_name=>"process_electrical_power_density", :xml_field_name=>"ProcElecPwrDens"},
      {:db_field_name=>"process_electrical_schedule_reference", :xml_field_name=>"ProcElecSchRef"},
      {:db_field_name=>"process_electrical_radiation_fraction", :xml_field_name=>"ProcElecRadFrac"},
      {:db_field_name=>"process_electrical_latent_fraction", :xml_field_name=>"ProcElecLatFrac"},
      {:db_field_name=>"process_electrical_lost_fraction", :xml_field_name=>"ProcElecLostFrac"},
      {:db_field_name=>"commercial_refrigeration_epd", :xml_field_name=>"CommRfrgEPD"},
      {:db_field_name=>"commercial_refrigeration_equipment_schedule_reference", :xml_field_name=>"CommRfrgEqpSchRef"},
      {:db_field_name=>"commercial_refrigeration_radiation_fraction", :xml_field_name=>"CommRfrgRadFrac"},
      {:db_field_name=>"commercial_refrigeration_latent_fraction", :xml_field_name=>"CommRfrgLatFrac"},
      {:db_field_name=>"commercial_refrigeration_lost_fraction", :xml_field_name=>"CommRfrgLostFrac"},
      {:db_field_name=>"elevator_count", :xml_field_name=>"ElevCnt"},
      {:db_field_name=>"elevator_power", :xml_field_name=>"ElevPwr"},
      {:db_field_name=>"elevator_schedule_reference", :xml_field_name=>"ElevSchRef"},
      {:db_field_name=>"elevator_radiation_fraction", :xml_field_name=>"ElevRadFrac"},
      {:db_field_name=>"elevator_latent_fraction", :xml_field_name=>"ElevLatFrac"},
      {:db_field_name=>"elevator_lost_fraction", :xml_field_name=>"ElevLostFrac"},
      {:db_field_name=>"escalator_count", :xml_field_name=>"EscalCnt"},
      {:db_field_name=>"escalator_power", :xml_field_name=>"EscalPwr"},
      {:db_field_name=>"escalator_schedule_reference", :xml_field_name=>"EscalSchRef"},
      {:db_field_name=>"escalator_radiation_fraction", :xml_field_name=>"EscalRadFrac"},
      {:db_field_name=>"escalator_latent_fraction", :xml_field_name=>"EscalLatFrac"},
      {:db_field_name=>"escalator_lost_fraction", :xml_field_name=>"EscalLostFrac"},
      {:db_field_name=>"process_gas_power_density", :xml_field_name=>"ProcGasPwrDens"},
      {:db_field_name=>"process_gas_schedule_reference", :xml_field_name=>"ProcGasSchRef"},
      {:db_field_name=>"process_gas_radiation_fraction", :xml_field_name=>"ProcGasRadFrac"},
      {:db_field_name=>"process_gas_latent_fraction", :xml_field_name=>"ProcGasLatFrac"},
      {:db_field_name=>"process_gas_lost_fraction", :xml_field_name=>"ProcGasLostFrac"},
      {:db_field_name=>"hot_water_heating_rate", :xml_field_name=>"HotWtrHtgRt"},
      {:db_field_name=>"hot_water_heating_schedule_reference", :xml_field_name=>"HotWtrHtgSchRef"},
      {:db_field_name=>"shw_fluid_segment_reference", :xml_field_name=>"SHWFluidSegRef"},
      {:db_field_name=>"recirculation_dhw_system_reference", :xml_field_name=>"RecircDHWSysRef"},
      {:db_field_name=>"infiltration_method", :xml_field_name=>"InfMthd"},
      {:db_field_name=>"design_infiltration_rate", :xml_field_name=>"DsgnInfRt"},
      {:db_field_name=>"infiltration_schedule_reference", :xml_field_name=>"InfSchRef"},
      {:db_field_name=>"infiltration_model_coefficient_a", :xml_field_name=>"InfModelCoefA"},
      {:db_field_name=>"infiltration_model_coefficient_b", :xml_field_name=>"InfModelCoefB"},
      {:db_field_name=>"infiltration_model_coefficient_c", :xml_field_name=>"InfModelCoefC"},
      {:db_field_name=>"infiltration_model_coefficient_d", :xml_field_name=>"InfModelCoefD"}
    ]
  end


  # This method is autogenerated. Do not change directly.
  def to_sdd_xml(parent, xml)
    xml.send(parent[:xml_name]) do
      self.class.xml_fields.each do |field|
        xml.send(:"#{field[:xml_field_name]}", self[field[:db_field_name]]) if self[field[:db_field_name]]
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
  def self.from_sdd_json(parent, h)
    o = nil
    if parent && h
      self_model = parent[:model_name].camelcase(:upper).constantize
      o = self_model.create_from_sdd_json(parent, h)
      if o
        o.create_children_from_sdd_json(parent, h)
        o.save!
        o.reload # in case of relationships being updated
      end
    end

    o
  end
  
  # This method is autogenerated. Do not change directly.
  def self.create_from_sdd_json(parent, h)
    new_h = {}

    # Find fields as defined by the XML
    self_model = parent[:model_name].camelcase(:upper).constantize
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

    o = self_model.new(new_h) unless new_h.empty?

    o
  end

  # This method is autogenerated. Do not change directly.
  def create_children_from_sdd_json(parent, h)
    # Go through the children
    self_model = parent[:model_name].camelcase(:upper).constantize
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
                model["#{parent[:model_name]}_id"] = self.id
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
              model["#{parent[:model_name]}_id"] = self.id
              model.save!
            else
              logger.warn "Class #{klass} does not have instance method 'from_sdd_json'"
            end
          end
        end
      end
    end
  end

  
  def space_function_enums
    [
      '- specify -',
      'Unoccupied-Include in Gross Floor Area',
      'Unoccupied-Exclude from Gross Floor Area',
      'Auditorium Area',
      'Auto Repair Area',
      'Bar, Cocktail Lounge and Casino Areas',
      'Beauty Salon Area',
      'Classrooms, Lecture, Training, Vocational Areas',
      'Civic Meeting Place Area',
      'Commercial and Industrial Storage Areas (conditioned or unconditioned)',
      'Commercial and Industrial Storage Areas (refrigerated)',
      'Computer Room',
      'Convention, Conference, Multipurpose and Meeting Center Areas',
      'Corridors, Restrooms, Stairs, and Support Areas',
      'Dining Area',
      'Dry Cleaning (Coin Operated)',
      'Dry Cleaning (Full Service Commercial)',
      'Electrical, Mechanical, Telephone Rooms',
      'Exercise Center, Gymnasium Areas',
      'Exhibit, Museum Areas',
      'Financial Transaction Area',
      'General Commercial and Industrial Work Areas, High Bay',
      'General Commercial and Industrial Work Areas, Low Bay',
      'General Commercial and Industrial Work Areas, Precision',
      'Grocery Sales Areas',
      'High-Rise Residential Living Spaces',
      'Hotel Function Area',
      'Hotel/Motel Guest Room',
      'Housing, Public and Common Areas',
      'Housing, Public and Common Areas',
      'Kitchen, Commercial Food Preparation',
      'Kitchenette or Residential Kitchen',
      'Laboratory, Scientific',
      'Laboratory, Equipment Room',
      'Laundry',
      'Library, Reading Areas',
      'Library, Stacks',
      'Lobby, Hotel',
      'Lobby, Main Entry',
      'Locker/Dressing Room',
      'Lounge, Recreation',
      'Malls and Atria',
      'Medical and Clinical Care',
      'Office (Greater than 250 square feet in floor area)',
      'Office (250 square feet in floor area or less)',
      'Parking Garage Building, Parking Area',
      'Parking Garage Area Dedicated Ramps',
      'Parking Garage Area Daylight Adaptation Zones',
      'Police Station and Fire Station',
      'Religious Worship Area',
      'Retail Merchandise Sales, Wholesale Showroom',
      'Sports Arena, Indoor Playing Area',
      'Theater, Motion Picture',
      'Theater, Performance',
      'Transportation Function',
      'Videoconferencing Studio',
      'Waiting Area'
    ]
  end

  def function_schedule_group_enums
    [
      '- specify -',
      'Assembly',
      'Data',
      'Health',
      'Laboratory',
      'Manufacturing',
      'Office',
      'Parking',
      'ResidentialLiving',
      'ResidentialCommon',
      'Restaurant',
      'Retail',
      'School',
      'Warehouse'
    ]
  end
end