class SpaceFunctionDefaultsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource :project # the resource is the project
  before_action :set_space_function_default, only: [:show, :edit, :update, :destroy]

  respond_to :json, :html

  def index
    @space_function_defaults = SpaceFunctionDefault.all
    respond_with(@space_function_defaults)
  end

  def show
    respond_with(@space_function_default)
  end

  def new
    @space_function_default = SpaceFunctionDefault.new
    respond_with(@space_function_default)
  end

  def edit
  end

  def create
    @space_function_default = SpaceFunctionDefault.new(space_function_default_params)
    @space_function_default.save
    respond_with(@space_function_default)
  end

  def update
    @space_function_default.update(space_function_default_params)
    respond_with(@space_function_default)
  end

  def destroy
    @space_function_default.destroy
    respond_with(@space_function_default)
  end

  private

  def set_space_function_default
    @space_function_default = SpaceFunctionDefault.find(params[:id])
  end

  def space_function_default_params
    params.require(:space_function_default).permit(:name, :space_function, :function_schedule_group, :occupant_density, :occupant_sensible_heat_rate, :occupant_latent_heat_rate, :occupant_schedule_reference, :ventilation_per_person, :ventilation_per_area, :ventilation_air_changes_per_hour, :exhaust_per_area, :exhaust_air_changes_per_hour, :interior_lighting_power_density_regulated, :interior_lighting_regulated_schedule_reference, :interior_lighting_regulated_heat_gain_space_fraction, :interior_lighting_regulated_heat_gain_radiant_fraction, :interior_lighting_power_density_non_regulated, :interior_lighting_non_regulated_schedule_reference, :interior_lighting_non_regulated_heat_gain_space_fraction, :interior_lighting_non_regulated_heat_gain_radiant_fraction, :receptacle_power_density, :receptacle_schedule_reference, :receptacle_radiation_fraction, :receptacle_latent_fraction, :receptacle_lost_fraction, :gas_equipment_power_density, :gas_equipment_schedule_reference, :gas_equipment_radiation_fraction, :gas_equipment_latent_fraction, :gas_equipment_lost_fraction, :process_electrical_power_density, :process_electrical_schedule_reference, :process_electrical_radiation_fraction, :process_electrical_latent_fraction, :process_electrical_lost_fraction, :commercial_refrigeration_epd, :commercial_refrigeration_equipment_schedule_reference, :commercial_refrigeration_radiation_fraction, :commercial_refrigeration_latent_fraction, :commercial_refrigeration_lost_fraction, :elevator_count, :elevator_power, :elevator_schedule_reference, :elevator_radiation_fraction, :elevator_latent_fraction, :elevator_lost_fraction, :escalator_count, :escalator_power, :escalator_schedule_reference, :escalator_radiation_fraction, :escalator_latent_fraction, :escalator_lost_fraction, :process_gas_power_density, :process_gas_schedule_reference, :process_gas_radiation_fraction, :process_gas_latent_fraction, :process_gas_lost_fraction, :hot_water_heating_rate, :hot_water_heating_schedule_reference, :shw_fluid_segment_reference, :recirculation_dhw_system_reference, :infiltration_method, :design_infiltration_rate, :infiltration_schedule_reference, :infiltration_model_coefficient_a, :infiltration_model_coefficient_b, :infiltration_model_coefficient_c, :infiltration_model_coefficient_d)
  end
end
