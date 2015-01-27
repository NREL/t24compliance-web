class FluidSystemsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource :project #the resource is project
  before_action :set_fluid_system, only: [:show, :edit, :update, :destroy]
  before_action :get_project, only: [:index, :update, :create, :bulk_sync]
  before_action :get_building, only: [:bulk_sync]

  respond_to :json, :html

  def index
    # return zone systems and air systems with all dependent records
    # TODO: also add pumps associated with chillers and boilers to returned object
    @fluid_systems = (@project.present?) ? @project.fluid_systems.includes(:chillers, :boilers, :fluid_segments, :heat_rejections) : []
    logger.info("FLUID SYSTEMS ARE: #{@fluid_systems.inspect}")
    respond_with(@fluid_systems)
  end

  def show
    respond_with(@fluid_system)
  end

  def new
    @fluid_system = FluidSystem.new
    respond_with(@fluid_system)
  end

  def edit
  end

  def create
  end

  # receives hash with form {project_id: ..., data: [array of fluid_systems]}
  # updates fluid_systems and related components
  def bulk_sync
    clean_params = fluid_systems_params
    logger.info("CLEAN PARAMS: #{clean_params.inspect}")

    # add / update
    systems = []
    if clean_params.has_key?('data')
      clean_params[:data].each do |rec|
        logger.info("REC: #{rec.inspect}")
        fluid_segments = []
        boilers = []
        chillers = []
        heat_rejections = []
        water_heater = {}

        # extract fluid segments from params hash
        fluid_segs = rec.extract!('fluid_segments')['fluid_segments']
        logger.info("FLUID SEGMENTS: #{fluid_segs.inspect}")
        fluid_segs.each do |seg|
          logger.info("SEG: #{seg}")
          if seg.has_key?('id') and !seg['id'].nil?
            @seg = FluidSegment.find(seg['id'])
            @seg.update(seg)
          else
            @seg = FluidSegment.new(seg)
            @seg.save
          end
          fluid_segments << @seg
        end

        # extract boilers/chillers/heat_rejections/water_heater from params hash
        blrs = rec.extract!('boilers')['boilers']
        logger.info("BOILERS: #{blrs.inspect}")
        chls = rec.extract!('chillers')['chillers']
        logger.info("CHILLERS: #{chls.inspect}")
        rejs = rec.extract!('heat_rejections')['heat_rejections']
        logger.info("HEAT REJECTIONS: #{rejs.inspect}")
        water_heater = rec.extract!('water_heater')['water_heater']
        logger.info("Water Heater: #{water_heater.inspect}")

        unless blrs.nil?
          blrs.each do |b|
            pumps = []
            # get associated pump first
            pump = b.extract!('pump')['pump']
            if pump.has_key?('id') and !pump['id'].nil?
              @pump = Pump.find(pump['id'])
              @pump.update(pump)
            else
              @pump = Pump.new(pump)
              @pump.save
            end
            pumps << @pump
            # then process boiler
            if b.has_key?('id') and !b['id'].nil?
              @b = Boiler.find(b['id'])
              @b.update(b)
            else
              @b = Boiler.new(b)
              @b.save
            end
            # save pumps to boilers
            @b.pumps = pumps
            @b.save
            boilers << @b
          end
        end

        unless chls.nil?
          chls.each do |c|
            pumps = []
            # get associated pump first
            pump = c.extract!('pump')['pump']
            if pump.has_key?('id') and !pump['id'].nil?
              @pump = Pump.find(pump['id'])
              @pump.update(pump)
            else
              @pump = Pump.new(pump)
              @pump.save
            end
            pumps << @pump
            # then process boiler
            if c.has_key?('id') and !c['id'].nil?
              @c = Chiller.find(c['id'])
              @c.update(c)
            else
              @c = Chiller.new(c)
              @c.save
            end
            # save pumps to chillers
            @c.pumps = pumps
            @c.save
            chillers << @c
          end
        end

        unless rejs.nil?
          rejs.each do |r|
            pumps = []
            # get associated pump first
            pump = r.extract!('pump')['pump']
            if pump.has_key?('id') and !pump['id'].nil?
              @pump = Pump.find(pump['id'])
              @pump.update(pump)
            else
              @pump = Pump.new(pump)
              @pump.save
            end
            pumps << @pump
            # then process boiler
            if r.has_key?('id') and !r['id'].nil?
              @r = HeatRejection.find(r['id'])
              @r.update(r)
            else
              @r = HeatRejection.new(r)
              @r.save
            end
            # save pumps to heat_rejections
            @r.pumps = pumps
            @r.save
            heat_rejections << @r
          end
        end

        unless water_heater.nil?
          heaters = []
          if water_heater.has_key?('id') and !water_heater['id'].nil?
            @water_heater = WaterHeater.find(water_heater['id'])
            @water_heater.update(water_heater)
          else
            @water_heater = WaterHeater.new(water_heater)
            @water_heater.save
          end
          heaters << @water_heater
        end

        # now save actual fluid_system
        if rec.has_key?('id') and !rec['id'].nil?
          @sys = FluidSystem.find(rec['id'])
          @sys.update(rec)
        else
          @sys = FluidSystem.new(rec)
        end
        @sys.fluid_segments = fluid_segments
        @sys.boilers = boilers
        logger.info("SYSTEM BOILERS:  #{@sys.boilers.inspect}")
        @sys.chillers = chillers
        @sys.heat_rejections = heat_rejections
        @sys.water_heaters = heaters
        @sys.save
        systems << @sys
      end

    end

    # delete (if data param is not present, it was stripped out b/c it was empty, so delete all)
    @project.fluid_systems = systems
    @project.save

    # now adjust FluidSegment In/Out references for all connected Zone Systems
    save_fluid_segment_references

    # TODO: add error handling?!
    respond_with systems.first || FluidSystem.new
  end

  def update
    @fluid_system.update(fluid_system_params)
    respond_with(@fluid_system)
  end

  def destroy
    @fluid_system.destroy
    respond_with(@fluid_system)
  end

  private
    def set_fluid_system
      @fluid_system = FluidSystem.find(params[:id])
    end

    def get_building
      @building = Building.where(:id => params[:building_id]).first
    end

    def get_project
      @project = Project.find(params[:project_id])
    end

    def fluid_systems_params
      params.permit(:project_id, :building_id, data: [:id, :name, :status, :type, :description, :design_supply_water_temperature, :heating_design_supply_water_temperature, :design_supply_water_temperature_delta_t, :control_type, :temperature_control, :fixed_supply_temperature, :temperature_setpoint_schedule_reference, :heating_fixed_supply_temperature, :heating_temperature_setpoint_schedule_reference, :reset_supply_high, :reset_supply_low, :reset_outdoor_high, :reset_outdoor_low, :wet_bulb_approach, :cooling_supply_temperature, :heating_supply_temperature, :evaporator_fluid_segment_in_reference, :shw_system_count, :annual_solar_fraction, fluid_segments: [:id, :name, :type], boilers: [:id, :name, :type, :fuel_source, :draft_type, :fluid_segment_in_reference, :fluid_segment_out_reference, :capacity_rated, :afue, :thermal_efficiency, pump: [:id, :name, :operation_control, :speed_control, :flow_capacity, :total_head, :motor_efficiency, :impeller_efficiency, :motor_hp]], chillers: [:id, :name, :type, :fuel_source, :condenser_type, :condenser_fluid_segment_in_reference, :condenser_fluid_segment_out_reference, :evaporator_fluid_segment_in_reference, :evaporator_fluid_segment_out_reference, :capacity_rated, :kw_per_ton, :iplv_kw_per_ton, pump: [:id, :name, :operation_control, :speed_control, :flow_capacity, :total_head, :motor_efficiency, :impeller_efficiency, :motor_hp]], water_heater: [:id, :name, :status, :type, :count, :fluid_segment_out_reference, :fluid_segment_makeup_reference, :storage_capacity, :ef, :recovery_efficiency, :thermal_efficiency, :hir_f_plr_curve_reference, :fuel_source, :off_cycle_fuel_source, :off_cycle_parasitic_losses, :on_cycle_fuel_source, :on_cycle_parasitic_losses, :tank_off_cycle_loss_coef, :capacity_rated, :minimum_capacity, :standby_loss_fraction, :electrical_ignition, :draft_fan_power], heat_rejections: [:id, :name, :type, :modulation_control, :fluid_segment_in_reference, :fluid_segment_out_reference, :capacity_rated, :total_fan_hp, :fan_type, pump: [:id, :name, :operation_control, :speed_control, :flow_capacity, :total_head, :motor_efficiency, :impeller_efficiency, :motor_hp]]])
    end

    # this is called from bulk_sync above
    def save_fluid_segment_references
      logger.info("SAVE FLUID SEGMENT REFERENCES")
      @project.fluid_systems.each do |sys|
        # logger.info("FLUID SYSTEM: #{sys.name}, type: #{sys.type}")
        in_segment = sys.fluid_segments.where(type: 'PrimarySupply').first
        out_segment = sys.fluid_segments.where(type: 'PrimaryReturn').first
        # connect to all HotWater heating coils and ChilledWater cooling coils saved to the building
        # TODO: find airsystems too in the future
        @building.zone_systems.each do |zone_sys|
          coils = []
          if sys.type == 'HotWater'
            coils = zone_sys.coil_heatings.where(type: sys.type)
          elsif sys.type == 'ChilledWater'
            coils = zone_sys.coil_coolings.where(type: sys.type)
          end
         # logger.info("#{sys.type} COILS FOR: #{zone_sys.name} are:")
          coils.each do |coil|
          # logger.info("#{coil.name} (#{coil.id})")
            # supply
            coil.fluid_segment_in_reference = in_segment.name
            # demand
            coil.fluid_segment_out_reference = out_segment.name
            coil.save
          end
        end
      end
    end
end
