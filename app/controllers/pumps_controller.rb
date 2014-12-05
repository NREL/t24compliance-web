class PumpsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :pump_params
  before_action :set_pump, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @pumps = Pump.all
    respond_with(@pumps)
  end

  def show
    respond_with(@pump)
  end

  def new
    @pump = Pump.new
    respond_with(@pump)
  end

  def edit
  end

  def create
    @pump = Pump.new(pump_params)
    @pump.save
    respond_with(@pump)
  end

  def update
    @pump.update(pump_params)
    respond_with(@pump)
  end

  def destroy
    @pump.destroy
    respond_with(@pump)
  end

  private
    def set_pump
      @pump = Pump.find(params[:id])
    end

    def pump_params
      params.require(:pump).permit(:name, :status, :operation_control, :speed_control, :modeling_method, :count, :flow_capacity, :total_head, :flow_minimum, :minimum_speed_ratio, :motor_efficiency, :impeller_efficiency, :motor_hp)
    end
end
