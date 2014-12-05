class TerminalUnitsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :terminal_unit_params
  before_action :set_terminal_unit, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @terminal_units = TerminalUnit.all
    respond_with(@terminal_units)
  end

  def show
    respond_with(@terminal_unit)
  end

  def new
    @terminal_unit = TerminalUnit.new
    respond_with(@terminal_unit)
  end

  def edit
  end

  def create
    @terminal_unit = TerminalUnit.new(terminal_unit_params)
    @terminal_unit.save
    respond_with(@terminal_unit)
  end

  def update
    @terminal_unit.update(terminal_unit_params)
    respond_with(@terminal_unit)
  end

  def destroy
    @terminal_unit.destroy
    respond_with(@terminal_unit)
  end

  private
    def set_terminal_unit
      @terminal_unit = TerminalUnit.find(params[:id])
    end

    def terminal_unit_params
      params.require(:terminal_unit).permit(:name, :status, :type, :zone_served_reference, :count, :minimum_air_fraction_schedule_reference, :primary_air_segment_reference, :primary_air_flow_maximum, :primary_air_flow_minimum, :heating_air_flow_maximum, :reheat_control_method, :induced_air_zone_reference, :induction_ratio, :fan_power_per_flow, :parallel_box_fan_flow_fraction)
    end
end
