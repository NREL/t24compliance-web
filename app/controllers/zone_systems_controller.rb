class ZoneSystemsController < ApplicationController
  before_action :set_zone_system, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @zone_systems = ZoneSystem.all
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
    @zone_system = ZoneSystem.new(zone_system_params)
    @zone_system.save
    respond_with(@zone_system)
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

    def zone_system_params
      params.require(:zone_system).permit(:name, :status, :type, :description, :hvac_auto_sizing, :fan_control, :cooling_control, :count, :cooling_design_supply_air_temperature, :heating_design_supply_air_temperature, :exhaust_system_type, :exhaust_operation_mode, :exhaust_control_method, :air_distribution_type)
    end
end
