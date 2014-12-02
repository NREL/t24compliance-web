class CoilCoolingsController < ApplicationController
  before_action :set_coil_cooling, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @coil_coolings = CoilCooling.all
    respond_with(@coil_coolings)
  end

  def show
    respond_with(@coil_cooling)
  end

  def new
    @coil_cooling = CoilCooling.new
    respond_with(@coil_cooling)
  end

  def edit
  end

  def create
    @coil_cooling = CoilCooling.new(coil_cooling_params)
    @coil_cooling.save
    respond_with(@coil_cooling)
  end

  def update
    @coil_cooling.update(coil_cooling_params)
    respond_with(@coil_cooling)
  end

  def destroy
    @coil_cooling.destroy
    respond_with(@coil_cooling)
  end

  private
    def set_coil_cooling
      @coil_cooling = CoilCooling.find(params[:id])
    end

    def coil_cooling_params
      params.require(:coil_cooling).permit(:name, :type, :fluid_segment_in_reference, :fluid_segment_out_reference, :fluid_flow_rate_design, :number_cooling_stages, :capacity_total_gross_rated, :capacity_total_net_rated, :capacity_total_rated_stage_fraction, :dxseer, :dxeer, :dx_crankcase_control_temperature, :dx_crankcase_heat_capacity, :minimum_hot_gas_ratio, :condenser_type, :auxilliary_power)
    end
end
