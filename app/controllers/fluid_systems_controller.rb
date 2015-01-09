class FluidSystemsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource :project #the resource is project
  before_action :set_fluid_system, only: [:show, :edit, :update, :destroy]
  before_action :get_project, only: [:index, :update, :create, :bulk_sync]

  respond_to :json, :html

  def index
    # return zone systems and air systems with all dependent records
    # TODO: also add pumps associated with chillers and boilers to returned object
    @fluid_systems = (@project.present?) ? @project.fluid_systems.includes(:chillers, :boilers, :fluid_segments) : []
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


        # extract fan from params hash
        fluid_segments = rec.extract!('fluid_segments')
        fluid_segments.each do |seg|
          if seg.has_key?('id') and !seg['id'].nil?
            @seg = FluidSegment.find(seg['id'])
            @seg.update(seg)
            fluid_segments << @seg
          else
            @seg = FluidSegment.new(seg)
            @seg.save
            fluid_segments << @seg
          end
        end

        # extract boilers/chillers from params hash
        boilers = rec.extract!('boilers')
        chillers = rec.extract!('chillers')

        boilers.each do |b|
          pumps = []
          # get associated pump first
          pump = b.extract!('pump')['pump']
          if pump.has_key?('id') and !pump['id'].nil?
            @pump = Pump.find(pump['id'])
            @pump.update(pump)
            pumps << @pump
          else
            @pump = Pump.new(pump)
            @pump.save
            pumps << @pump
          end
          # then process boiler
          if b.has_key?('id') and !b['id'].nil?
            @b = Boiler.find(b['id'])
            @b.update(b)
            boilers << @b
          else
            @b = Boiler.new(b)
            @b.save
            boilers << @b
          end
          # save pumps to boilers
          @b.pumps = pumps
          @b.save

        end

        chillers.each do |c|
          pumps = []
          # get associated pump first
          pump = c.extract!('pump')['pump']
          if pump.has_key?('id') and !pump['id'].nil?
            @pump = Pump.find(pump['id'])
            @pump.update(pump)
            pumps << @pump
          else
            @pump = Pump.new(pump)
            @pump.save
            pumps << @pump
          end
          # then process boiler
          if c.has_key?('id') and !c['id'].nil?
            @c = Chiller.find(c['id'])
            @c.update(c)
            chillers << @c
          else
            @c = Chiller.new(c)
            @c.save
            chillers << @c
          end
          # save pumps to boilers
          @c.pumps = pumps
          @c.save

        end

        # now save actual fluid_system
        if rec.has_key?('id') and !rec['id'].nil?
          @sys = FluidSystem.find(rec['id'])
          @sys.fluid_segments = fluid_segments
          @sys.boilers = boilers
          @sys.chillers = chillers
          @sys.update(rec)
          systems << @sys
        else
          @sys = FluidSystem.new(rec)
          @sys.fluid_segments = fluid_segments
          @sys.boilers = boilers
          @sys.chillers = chillers
          @sys.save
          systems << @sys
        end

      end
    end
    # delete
    @project.fluid_systems = systems
    @project.save

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
      params.permit(:project_id, :building_id, data: [:id, :name, :status, :type, :description, :design_supply_water_temperature, :heating_design_supply_water_temperature, :design_supply_water_temperature_delta_t, :control_type, :temperature_control, :fixed_supply_temperature, :temperature_setpoint_schedule_reference, :heating_fixed_supply_temperature, :heating_temperature_setpoint_schedule_reference, :reset_supply_high, :reset_supply_low, :reset_outdoor_high, :reset_outdoor_low, :wet_bulb_approach, :cooling_supply_temperature, :heating_supply_temperature, :evaporator_fluid_segment_in_reference, :shw_system_count, :annual_solar_fraction, fluid_segment: [:id, :name, :type], boiler: [:id, :name, :type, :fuel_source, :draft_type, :fluid_segment_in_reference, :fluid_segment_out_reference, :capacity_rated, :afue, :thermal_efficiency, pump: [:id, :name, :operation_control, :speed_control, :flow_capacity, :total_head, :motor_efficiency, :impeller_efficiency, :motor_hp]], chiller: [:id, :name, :type, :fuel_source, :condenser_type, :condenser_fluid_segment_in_reference, :condenser_fluid_segment_out_reference, :evaporator_fluid_segment_in_reference, :evaporator_fluid_segment_out_reference, :capacity_rated, :kw_per_ton, :iplv_kw_per_ton, pump: [:id, :name, :operation_control, :speed_control]]])
    end
end
