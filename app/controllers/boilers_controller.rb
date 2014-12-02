class BoilersController < ApplicationController
  before_action :set_boiler, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @boilers = Boiler.all
    respond_with(@boilers)
  end

  def show
    respond_with(@boiler)
  end

  def new
    @boiler = Boiler.new
    respond_with(@boiler)
  end

  def edit
  end

  def create
    @boiler = Boiler.new(boiler_params)
    @boiler.save
    respond_with(@boiler)
  end

  def update
    @boiler.update(boiler_params)
    respond_with(@boiler)
  end

  def destroy
    @boiler.destroy
    respond_with(@boiler)
  end

  private
    def set_boiler
      @boiler = Boiler.find(params[:id])
    end

    def boiler_params
      params.require(:boiler).permit(:name, :status, :type, :fuel_source, :draft_type, :fluid_segment_in_reference, :fluid_segment_out_reference, :has_bypass, :entering_temperature_design, :leaving_temperature_design, :capacity_rated, :afue, :combustion_efficiency, :thermal_efficiency, :hir_f_plr_curve_reference, :eir, :fuel_full_load, :heat_loss, :unload_ratio_minimum, :draft_fan_horse_power, :parasitic_load, :water_flow_capacity)
    end
end
