class OutsideAirControlsController < ApplicationController
  before_action :set_outside_air_control, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @outside_air_controls = OutsideAirControl.all
    respond_with(@outside_air_controls)
  end

  def show
    respond_with(@outside_air_control)
  end

  def new
    @outside_air_control = OutsideAirControl.new
    respond_with(@outside_air_control)
  end

  def edit
  end

  def create
    @outside_air_control = OutsideAirControl.new(outside_air_control_params)
    @outside_air_control.save
    respond_with(@outside_air_control)
  end

  def update
    @outside_air_control.update(outside_air_control_params)
    respond_with(@outside_air_control)
  end

  def destroy
    @outside_air_control.destroy
    respond_with(@outside_air_control)
  end

  private
    def set_outside_air_control
      @outside_air_control = OutsideAirControl.find(params[:id])
    end

    def outside_air_control_params
      params.require(:outside_air_control).permit(:name, :economizer_control_method, :economizer_integration, :economizer_high_temperature_lockout, :economizer_low_temperature_lockout, :air_segment_supply_reference, :air_segment_return_reference)
    end
end
