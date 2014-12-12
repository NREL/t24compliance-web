class FansController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :fan_params
  before_action :set_fan, only: [:show, :edit, :update, :destroy]

  respond_to :html, :json

  def index
    @fans = Fan.all
    respond_with(@fans)
  end

  def show
    respond_with(@fan)
  end

  def new
    @fan = Fan.new
    respond_with(@fan)
  end

  def edit
  end

  def create
    @fan = Fan.new(fan_params)
    @fan.save
    respond_with(@fan)
  end

  def update
    @fan.update(fan_params)
    respond_with(@fan)
  end

  def destroy
    @fan.destroy
    respond_with(@fan)
  end

  private
    def set_fan
      @fan = Fan.find(params[:id])
    end

    def fan_params
      params.require(:fan).permit(:name, :control_method, :classification, :centrifugal_type, :modeling_method, :flow_capacity, :flow_minimum, :flow_efficiency, :total_static_pressure, :motor_bhp, :motor_hp, :motor_type, :motor_pole_count, :motor_efficiency, :motor_position)
    end
end
