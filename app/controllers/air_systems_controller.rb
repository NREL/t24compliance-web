class AirSystemsController < ApplicationController
  before_action :set_air_system, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @air_systems = AirSystem.all
    respond_with(@air_systems)
  end

  def show
    respond_with(@air_system)
  end

  def new
    @air_system = AirSystem.new
    respond_with(@air_system)
  end

  def edit
  end

  def create
    @air_system = AirSystem.new(air_system_params)
    @air_system.save
    respond_with(@air_system)
  end

  def update
    @air_system.update(air_system_params)
    respond_with(@air_system)
  end

  def destroy
    @air_system.destroy
    respond_with(@air_system)
  end

  private
    def set_air_system
      @air_system = AirSystem.find(params[:id])
    end

    def air_system_params
      params.require(:air_system).permit(:name, :status, :type, :sub_type, :description, :control_system_type, :control_zone_reference, :night_cycle_fan_control, :reheat_control_method, :count, :fan_position, :cooling_design_supply_air_temperature, :heating_design_supply_air_temperature, :design_air_flow_minimum, :design_preheat_temperature, :design_preheat_humidity_ratio, :design_precool_temperature, :design_precool_humidity_ratio, :sizing_option, :cooling_all_outside_air, :heating_all_outside_air, :cooling_design_humidity_ratio, :heating_design_humidity_ratio, :cooling_control, :cooling_fixed_supply_temperature, :cooling_setpoint_schedule_reference, :cool_reset_supply_high, :cool_reset_supply_low, :cool_reset_outdoor_low, :cool_reset_outdoor_high, :exhaust_system_type, :exhaust_operation_mode, :exhaust_control_method, :air_distribution_type)
    end
end
