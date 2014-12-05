class HeatRejectionsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :heat_rejection_params
  before_action :set_heat_rejection, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @heat_rejections = HeatRejection.all
    respond_with(@heat_rejections)
  end

  def show
    respond_with(@heat_rejection)
  end

  def new
    @heat_rejection = HeatRejection.new
    respond_with(@heat_rejection)
  end

  def edit
  end

  def create
    @heat_rejection = HeatRejection.new(heat_rejection_params)
    @heat_rejection.save
    respond_with(@heat_rejection)
  end

  def update
    @heat_rejection.update(heat_rejection_params)
    respond_with(@heat_rejection)
  end

  def destroy
    @heat_rejection.destroy
    respond_with(@heat_rejection)
  end

  private
    def set_heat_rejection
      @heat_rejection = HeatRejection.find(params[:id])
    end

    def heat_rejection_params
      params.require(:heat_rejection).permit(:name, :status, :type, :fan_type, :modulation_control, :fluid_segment_in_reference, :fluid_segment_out_reference, :entering_temperature_design, :design_wb_temperature, :leaving_temperature_design, :cell_count, :capacity_rated, :total_fan_hp, :air_flow_capacity, :water_flow_capacity, :power_f_plr_curve_reference, :low_speed_air_flow_ratio, :low_speed_power_ratio, :minimum_speed_ratio)
    end
end
