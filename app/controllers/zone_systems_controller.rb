class ZoneSystemsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource :building #the resource is building
  before_action :set_zone_system, only: [:show, :edit, :update, :destroy]
  before_action :get_building, only: [:index, :update, :create, :bulk_sync]

  respond_to :json, :html

  def index
    @systems = []
    # return zone systems and air systems with dependent fan & coils.  Add to same array for jbuilder view
    @zone_systems = (@building.present?) ? @building.zone_systems.includes(:fans, :coil_coolings,:coil_heatings) : []
    logger.info("ZONE SYSTEMS: #{@zone_systems[0].inspect}")
    @zone_systems.each do |zone|
      sys = zone
      sys['fan'] = zone.fans.first
      sys['coil_cooling'] = zone.coil_coolings.first
      sys['coil_heating'] = zone.coil_heatings.first
      @systems << sys
    end
    # extract fan & coils from air segments:
    @air_systems = (@building.present?) ? @building.air_systems : []
    @air_systems.each do |air|
      sys = air
      seg = sys.air_segments.where(type: 'Supply').first
      unless seg.nil?
        sys['fan'] = seg.fans.first
        sys['coil_cooling'] = seg.coil_coolings.first
        sys['coil_heating'] = seg.coil_heatings.first
      end
      @systems << sys
    end

    respond_with(@systems)
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
  # updates zone_systems and air_systems
  def bulk_sync
    clean_params = systems_params
    logger.info("CLEAN PARAMS: #{clean_params.inspect}")

    zone_systems = []
    air_systems = []

    # add / update
    if clean_params.has_key?('data')
      clean_params[:data].each do |rec|
        logger.info("RECORD of type #{rec['type']}:  #{rec.inspect}")

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

        #air vs zone systems
        if %w(PTAC FPFC Exhaust).include? rec['type']
          # ZONE SYSTEMS
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
        elsif %w(SZAC).include? rec['type']
          # AIR SYSTEMS: 1 air segment (supply) contains fan and coils.  1 air segment (return)
          # TODO: what to set 'path' to in airseg?  (do it from zones tab)
          segments = []
          if rec.has_key?('id') and !rec['id'].nil?
            @sys = AirSystem.find(rec['id'])
            @sys.air_segments.each do |seg|
              if seg.type === 'Supply'
                # attach fan & coils to this segment
                seg.fans = fans
                seg.coil_coolings = coil_coolings
                seg.coil_heatings = coil_heatings
                seg.save
              end
              segments << seg
              @sys.update(rec)
            end
          else
            @sys = AirSystem.new(rec)
            sup_seg = AirSegment.new({name: "#{rec['name']} SupplyAirSeg", type: 'Supply'})
            sup_seg.fans = fans
            sup_seg.coil_coolings = coil_coolings
            sup_seg.coil_heatings = coil_heatings
            sup_seg.save
            segments << sup_seg
            ret_seg = AirSegment.new({name: "#{rec['name']} ReturnAirSeg", type: 'Return'})
            ret_seg.save
            segments << ret_seg
            @sys.air_segments = segments
            @sys.save
          end
          air_systems << @sys
        end
      end
    end

    # delete
    @building.zone_systems = zone_systems
    @building.air_systems = air_systems
    @building.save

    # TODO: add error handling?!
    respond_with zone_systems.first || ZoneSystem.new
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
    def systems_params
      params.permit(:project_id, :building_id, data: [:id, :name, :building_id, :status, :type, :sub_type, :control_zone_reference, :fan_control, :cooling_control, :count, :cooling_design_supply_air_temperature, :heating_design_supply_air_temperature, :exhaust_system_type, :exhaust_operation_mode, :exhaust_control_method,:hvac_auto_sizing, :description, :air_distribution_type, fan: [:id, :name, :classification, :centrifugal_type, :modeling_method, :control_method, :total_static_pressure, :flow_efficiency, :motor_bhp, :motor_hp, :motor_type, :motor_pole_count, :motor_efficiency, :motor_position], coil_cooling: [:id, :name, :type, :condenser_type, :dxeer], coil_heating: [:id, :name, :type, :fluid_segment_in_reference, :fluid_segment_out_reference, :fuel_source, :furnace_afue ]])
    end
end
