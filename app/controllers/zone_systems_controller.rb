class ZoneSystemsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource
  before_action :set_zone_system, only: [:show, :edit, :update, :destroy]
  before_action :get_building, only: [:index, :update, :create]

  respond_to :json, :html

  def index
    @zone_systems = (@building.present?) ? @building.zone_systems : []
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

  # OVERWRITING CREATE AS BULK UPDATE
  def create
    clean_params = zone_systems_params
    logger.info("CLEAN PARAMS: #{clean_params.inspect}")

    # add / update
    systems = []
    if clean_params.has_key?('_json')
      clean_params[:_json].each do |rec|
        logger.info("REC: #{rec.inspect}")
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

        if cool.has_key?('id') and !cool['id'].nil?
          @cool = CoilCooling.find(cool['id'])
          @cool.update(cool)
          coil_coolings << @cool
        else
          @cool = CoilCooling.new(cool)
          @cool.save
          coil_coolings << @cool
        end

        if heat.has_key?('id') and !heat['id'].nil?
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
          systems << @sys
        else
          @sys = ZoneSystem.new(rec)
          @sys.fans = fans
          @sys.coil_coolings = coil_coolings
          @sys.coil_heatings = coil_heatings
          @sys.save
          systems << @sys
        end

      end
    end

    # delete
    @building.zone_systems = systems
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
      params.permit(:building_id, _json: [:id, :name, :building_id, :status, :type, :fan_control, :cooling_control, :count, :cooling_design_supply_air_temperature, :heating_design_supply_air_temperature, :exhaust_system_type, :exhaust_operation_mode, :exhaust_control_method, fan: [:id, :name, :control_method, :total_static_pressure, :flow_efficiency, :motor_hp, :motor_type, :motor_pole_count, :motor_efficiency, :motor_position], coil_cooling: [:id, :name, :type, :condenser_type], coil_heating: [:id, :name, :type, :fluid_segment_in_reference, :fluid_segment_out_reference ]])
    end
end
