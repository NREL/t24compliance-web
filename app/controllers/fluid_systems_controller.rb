class FluidSystemsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :fluid_system_params
  before_action :set_fluid_system, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @fluid_systems = FluidSystem.all
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
    @fluid_system = FluidSystem.new(fluid_system_params)
    @fluid_system.save
    respond_with(@fluid_system)
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

    def fluid_system_params
      params.require(:fluid_system).permit(:name, :status, :type, :description, :design_supply_water_temperature, :heating_design_supply_water_temperature, :design_supply_water_temperature_delta_t, :control_type, :temperature_control, :fixed_supply_temperature, :temperature_setpoint_schedule_reference, :heating_fixed_supply_temperature, :heating_temperature_setpoint_schedule_reference, :reset_supply_high, :reset_supply_low, :reset_outdoor_high, :reset_outdoor_low, :wet_bulb_approach, :cooling_supply_temperature, :heating_supply_temperature, :evaporator_fluid_segment_in_reference, :shw_system_count, :annual_solar_fraction)
    end
end
