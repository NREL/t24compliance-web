class ChillersController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :chiller_params
  before_action :set_chiller, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @chillers = Chiller.all
    respond_with(@chillers)
  end

  def show
    respond_with(@chiller)
  end

  def new
    @chiller = Chiller.new
    respond_with(@chiller)
  end

  def edit
  end

  def create
    @chiller = Chiller.new(chiller_params)
    @chiller.save
    respond_with(@chiller)
  end

  def update
    @chiller.update(chiller_params)
    respond_with(@chiller)
  end

  def destroy
    @chiller.destroy
    respond_with(@chiller)
  end

  private

  def set_chiller
    @chiller = Chiller.find(params[:id])
  end

  def chiller_params
    params.require(:chiller).permit(:name, :status, :type, :fuel_source, :condenser_type, :condenser_fluid_segment_in_reference, :condenser_fluid_segment_out_reference, :evaporator_fluid_segment_in_reference, :evaporator_fluid_segment_out_reference, :evaporator_has_bypass, :entering_temperature_design, :entering_temperature_rated, :leaving_temperature_design, :leaving_temperature_rated, :capacity_rated, :condenser_power_rated, :kw_per_ton, :eer, :cop, :iplv_kw_per_ton, :iplveer, :iplvcop, :unload_ratio_minimum, :part_load_ratio_minimum, :water_flow_capacity)
  end
end
