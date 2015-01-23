class ThermalZonesController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource :building #the resource is building
  before_action :set_thermal_zone, only: [:show, :edit, :update, :destroy]
  before_action :set_building, only: [:index, :bulk_sync]

  respond_to :json, :html

  def index
    # always scope by building
    @thermal_zones = (@building.present?) ? @building.thermal_zones : []
    respond_with(@thermal_zones)
  end

  def show
    respond_with(@thermal_zone)
  end

  def new
    @thermal_zone = ThermalZone.new
    respond_with(@thermal_zone)
  end

  def edit
  end

  def create
    @thermal_zone = ThermalZone.new(thermal_zone_params)
    @thermal_zone.save
    respond_with(@thermal_zone)
  end

  # receives hash with form {building_id: ..., data: [array of zones]}
  def bulk_sync
    clean_params = thermal_zones_params
    logger.info("CLEAN PARAMS: #{clean_params.inspect}")

    # add / update
    zones = []
    if clean_params.has_key?('data')
      clean_params[:data].each do |rec|
        logger.info("REC: #{rec.inspect}")

        if rec.has_key?('id') and !rec['id'].nil?
          @zone = ThermalZone.find(rec['id'])
          @zone.update(rec)
        else
          @zone = ThermalZone.new(rec)
          @zone.save
        end
        zones << @zone
      end
    end

    # delete old zones (if data param was not there, means it was empty and stripped out so delete all)
    @building.thermal_zones = zones
    @building.save

    # TODO: add error handling?!
    respond_with zones.first || ZoneSystem.new

  end

  def update
  end

  def destroy
    @thermal_zone.destroy
    respond_with(@thermal_zone)
  end

  private
    def set_thermal_zone
      @thermal_zone = ThermalZone.find(params[:id])
    end

    def set_building
      @building = (params[:building_id].present?) ? Building.find(params[:building_id]) : nil
    end

    def thermal_zones_params
      params.permit(:project_id, :building_id, data: [:id, :name,:type, :multiplier, :description, :supply_plenum_zone_reference, :return_plenum_zone_reference, :hvac_zone_count, :primary_air_conditioning_system_reference, :ventilation_system_reference, :cooling_design_supply_air_temperature, :cooling_design_supply_air_temperature_difference, :cooling_design_sizing_factor, :heating_design_supply_air_temperature, :heating_design_supply_air_temperature_difference, :heating_design_sizing_factor, :heating_design_maximum_flow_fraction, :ventilation_source, :ventilation_control_method, :ventilation_specification_method, :daylighting_control_lighting_fraction1, :daylighting_control_lighting_fraction2, :daylighting_control_type, :daylighting_minimum_dimming_light_fraction, :daylighting_minimum_dimming_power_fraction, :daylighting_number_of_control_steps, :exhaust_system_reference, :exhaust_fan_name, :exhaust_flow_simulated])
    end
end
