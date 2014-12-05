class WaterHeatersController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :water_heater_params
  before_action :set_water_heater, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @water_heaters = WaterHeater.all
    respond_with(@water_heaters)
  end

  def show
    respond_with(@water_heater)
  end

  def new
    @water_heater = WaterHeater.new
    respond_with(@water_heater)
  end

  def edit
  end

  def create
    @water_heater = WaterHeater.new(water_heater_params)
    @water_heater.save
    respond_with(@water_heater)
  end

  def update
    @water_heater.update(water_heater_params)
    respond_with(@water_heater)
  end

  def destroy
    @water_heater.destroy
    respond_with(@water_heater)
  end

  private
    def set_water_heater
      @water_heater = WaterHeater.find(params[:id])
    end

    def water_heater_params
      params.require(:water_heater).permit(:name, :status, :type, :count, :fluid_segment_out_reference, :fluid_segment_makeup_reference, :storage_capacity, :ef, :recovery_efficiency, :thermal_efficiency, :hir_f_plr_curve_reference, :fuel_source, :off_cycle_fuel_source, :off_cycle_parasitic_losses, :on_cycle_fuel_source, :on_cycle_parasitic_losses, :tank_off_cycle_loss_coef, :capacity_rated, :minimum_capacity, :standby_loss_fraction, :electrical_ignition, :draft_fan_power)
    end
end
