class ThermalZonesController < ApplicationController
  before_action :set_thermal_zone, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @thermal_zones = ThermalZone.all
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

  def update
    @thermal_zone.update(thermal_zone_params)
    respond_with(@thermal_zone)
  end

  def destroy
    @thermal_zone.destroy
    respond_with(@thermal_zone)
  end

  private
    def set_thermal_zone
      @thermal_zone = ThermalZone.find(params[:id])
    end

    def thermal_zone_params
      params.require(:thermal_zone).permit(:name, :type, :multiplier, :description, :supply_plenum_zone_reference, :return_plenum_zone_reference, :hvac_zone_count, :primary_air_conditioning_system_reference, :ventilation_system_reference, :cooling_design_supply_air_temperature, :cooling_design_supply_air_temperature_difference, :cooling_design_sizing_factor, :heating_design_supply_air_temperature, :heating_design_supply_air_temperature_difference, :heating_design_sizing_factor, :heating_design_maximum_flow_fraction, :ventilation_source, :ventilation_control_method, :ventilation_specification_method, :daylighting_control_lighting_fraction1, :daylighting_control_lighting_fraction2, :daylighting_control_type, :daylighting_minimum_dimming_light_fraction, :daylighting_minimum_dimming_power_fraction, :daylighting_number_of_control_steps, :exhaust_system_reference, :exhaust_fan_name, :exhaust_flow_simulated)
    end
end
