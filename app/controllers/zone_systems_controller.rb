class ZoneSystemsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource :building #the resource is building
  before_action :set_zone_system, only: [:show, :edit, :update, :destroy]
  before_action :get_building, only: [:index, :update, :create, :bulk_sync]

  respond_to :json, :html

  def index
    # return zone systems and air systems with all dependent records
    @zone_systems = (@building.present?) ? @building.zone_systems.includes(:fans, :coil_coolings,:coil_heatings) : []
    respond_with(@zone_systems)
  end

  def show
    respond_with(@zone_system)
  end

  def new
    @zone_system = ZoneSystem.new
    respond_with(@zone_system)
  end

  def edit
  end

  def create
  end

  # receives hash with form {building_id: ..., data: [array of systems]}
  # updates zone_systems and air_systems?
  def bulk_sync
    clean_params = zone_systems_params
    logger.info("CLEAN PARAMS: #{clean_params.inspect}")

    # add / update
    zone_systems = []
    air_systems = []
    if clean_params.has_key?('data')
      clean_params[:data].each do |rec|
        logger.info("REC: #{rec.inspect}")

        #air vs zone systems
       # if ['PTAC', 'FPFC'].

        fans = []
        coil_coolings = []
        coil_heatings = []

        # extract fan from params hash
        fan = rec.extract!('fan')['fan']
        #logger.info("REC NOW: #{rec.inspect}")
        #logger.info("FAN NOW: #{fan.inspect}")
        if fan.has_key?('id') and !fan['id'].nil?
          @fan = Fan.find(fan['id'])
          @fan.update(fan)
          fans << @fan
        else
          @fan = Fan.new(fan)
          @fan.save
          fans << @fan
        end

        # extract coils from params hash
        cool = rec.extract!('coil_cooling')['coil_cooling']
        heat = rec.extract!('coil_heating')['coil_heating']

        if !cool.nil? and cool.has_key?('id') and !cool['id'].nil?
          @cool = CoilCooling.find(cool['id'])
          @cool.update(cool)
          coil_coolings << @cool
        else
          @cool = CoilCooling.new(cool)
          @cool.save
          coil_coolings << @cool
        end

        if !heat.nil? and heat.has_key?('id') and !heat['id'].nil?
          @heat = CoilHeating.find(heat['id'])
          @heat.update(heat)
          coil_heatings << @heat
        else
          @heat = CoilHeating.new(heat)
          @heat.save
          coil_heatings << @heat
        end

        if rec.has_key?('id') and !rec['id'].nil?

          @sys = ZoneSystem.find(rec['id'])
          @sys.fans = fans
          @sys.coil_coolings = coil_coolings
          @sys.coil_heatings = coil_heatings
          @sys.update(rec)

        else
          @sys = ZoneSystem.new(rec)
          @sys.fans = fans
          @sys.coil_coolings = coil_coolings
          @sys.coil_heatings = coil_heatings
          @sys.save
        end
        zone_systems << @sys
      end
    end

    # delete
    @building.zone_systems = zone_systems
    @building.save

    # TODO: add error handling?!
    respond_with systems.first || ZoneSystem.new
  end

  def update
    @zone_system.update(zone_system_params)
    respond_with(@zone_system)
  end

  def destroy
    @zone_system.destroy
    respond_with(@zone_system)
  end

  private
    def set_zone_system
      @zone_system = ZoneSystem.find(params[:id])
    end

    def get_building
      @building = Building.where(:id => params[:building_id]).first
    end


    #def zone_system_params
    #  params.require(:zone_system).permit(:name, :status, :type, :description, :hvac_auto_sizing, :fan_control, :cooling_control, :count, :cooling_design_supply_air_temperature, :heating_design_supply_air_temperature, :exhaust_system_type, :exhaust_operation_mode, :exhaust_control_method, :air_distribution_type)
    #end

    #for update_all
    def zone_systems_params
      params.permit(:project_id, :building_id, data: [:id, :name, :building_id, :status, :type, :fan_control, :cooling_control, :count, :cooling_design_supply_air_temperature, :heating_design_supply_air_temperature, :exhaust_system_type, :exhaust_operation_mode, :exhaust_control_method,:hvac_auto_sizing, :description, :air_distribution_type, fan: [:id, :name, :classification, :centrifugal_type, :modeling_method, :control_method, :total_static_pressure, :flow_efficiency, :motor_bhp, :motor_hp, :motor_type, :motor_pole_count, :motor_efficiency, :motor_position], coil_cooling: [:id, :name, :type, :condenser_type], coil_heating: [:id, :name, :type, :fluid_segment_in_reference, :fluid_segment_out_reference ]])
    end
end
