class RecirculationWaterHeatersController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :recirculation_water_heater_params
  before_action :set_recirculation_water_heater, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @recirculation_water_heaters = RecirculationWaterHeater.all
    respond_with(@recirculation_water_heaters)
  end

  def show
    respond_with(@recirculation_water_heater)
  end

  def new
    @recirculation_water_heater = RecirculationWaterHeater.new
    respond_with(@recirculation_water_heater)
  end

  def edit
  end

  def create
    @recirculation_water_heater = RecirculationWaterHeater.new(recirculation_water_heater_params)
    @recirculation_water_heater.save
    respond_with(@recirculation_water_heater)
  end

  def update
    @recirculation_water_heater.update(recirculation_water_heater_params)
    respond_with(@recirculation_water_heater)
  end

  def destroy
    @recirculation_water_heater.destroy
    respond_with(@recirculation_water_heater)
  end

  private
    def set_recirculation_water_heater
      @recirculation_water_heater = RecirculationWaterHeater.find(params[:id])
    end

    def recirculation_water_heater_params
      params.require(:recirculation_water_heater).permit(:name, :status, :element_type, :tank_category, :tank_type, :input_rating, :energy_factor, :tank_volume, :tank_interior_insulation_r_value, :tank_exterior_insulation_r_value, :ambient_condition, :standby_loss_fraction, :thermal_efficiency)
    end
end
