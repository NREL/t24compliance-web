class EvaporativeCoolersController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :evaporative_cooler_params
  before_action :set_evaporative_cooler, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @evaporative_coolers = EvaporativeCooler.all
    respond_with(@evaporative_coolers)
  end

  def show
    respond_with(@evaporative_cooler)
  end

  def new
    @evaporative_cooler = EvaporativeCooler.new
    respond_with(@evaporative_cooler)
  end

  def edit
  end

  def create
    @evaporative_cooler = EvaporativeCooler.new(evaporative_cooler_params)
    @evaporative_cooler.save
    respond_with(@evaporative_cooler)
  end

  def update
    @evaporative_cooler.update(evaporative_cooler_params)
    respond_with(@evaporative_cooler)
  end

  def destroy
    @evaporative_cooler.destroy
    respond_with(@evaporative_cooler)
  end

  private

  def set_evaporative_cooler
    @evaporative_cooler = EvaporativeCooler.find(params[:id])
  end

  def evaporative_cooler_params
    params.require(:evaporative_cooler).permit(:name, :type, :effectiveness, :pump_power, :indirect_dew_point_effectiveness, :secondary_fan_flow_capacity, :secondary_fan_total_efficiency, :secondary_fan_total_static_pressure, :secondary_air_source)
  end
end
