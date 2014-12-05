class CoilHeatingsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :coil_heating_params
  before_action :set_coil_heating, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @coil_heatings = CoilHeating.all
    respond_with(@coil_heatings)
  end

  def show
    respond_with(@coil_heating)
  end

  def new
    @coil_heating = CoilHeating.new
    respond_with(@coil_heating)
  end

  def edit
  end

  def create
    @coil_heating = CoilHeating.new(coil_heating_params)
    @coil_heating.save
    respond_with(@coil_heating)
  end

  def update
    @coil_heating.update(coil_heating_params)
    respond_with(@coil_heating)
  end

  def destroy
    @coil_heating.destroy
    respond_with(@coil_heating)
  end

  private
    def set_coil_heating
      @coil_heating = CoilHeating.find(params[:id])
    end

    def coil_heating_params
      params.require(:coil_heating).permit(:name, :type, :fuel_source, :fluid_segment_in_reference, :fluid_segment_out_reference, :fluid_flow_rate_design, :capacity_total_gross_rated, :capacity_total_net_rated, :capacity_total_rated_stage_fraction, :furnace_afue, :furnace_thermal_efficiency, :furnace_ignition_type, :furnace_pilot_fuel_input, :condenser_type, :heat_pump_hspf, :heat_pump_cop, :heat_pump_supplemental_coil_heating_reference, :heat_pump_compressor_lockout_temperature, :heat_pump_supplemental_temperature, :heat_pump_crankcase_heat_capacity, :heat_pump_crankcase_control_temperature, :heat_pump_defrost_heat_source, :heat_pump_defrost_heat_capacity, :heat_pump_defrost_control, :auxilliary_power)
    end
end
