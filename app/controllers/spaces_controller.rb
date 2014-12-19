class SpacesController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :space_params
  before_action :set_space, only: [:show, :edit, :update, :destroy]
  before_action :set_building, only: [:index]
  respond_to :html, :json

  def index
    # always scope by building
    @spaces = (@building.nil?) ? [] : @building.building_stories.inject([]) { |spaces, story| spaces + story.spaces }
    respond_with(@spaces)
  end

  def show
    respond_with(@space)
  end

  def new
    @space = Space.new
    respond_with(@space)
  end

  def edit
  end

  def create
    @space = Space.new(space_params)
    @space.save
    respond_with(@space)
  end

  def update
    @space.update(space_params)
    respond_with(@space)
  end

  def destroy
    @space.destroy
    respond_with(@space)
  end

  private

    def set_building
      @building = (params[:building_id].present?) ? Building.find(params[:building_id]) : nil
    end

    def set_space
      @space = Space.find(params[:id])
    end

    def space_params
      params.require(:space).permit(:name, :status, :conditioning_type, :supply_plenum_space_reference, :return_plenum_space_reference, :thermal_zone_reference, :area, :floor_area, :floor_z, :floor_to_ceiling_height, :volume, :space_function_defaults_reference, :space_function, :function_schedule_group, :occupant_density, :occupant_sensible_heat_rate, :occupant_latent_heat_rate, :occupant_schedule_reference, :infiltration_method, :design_infiltration_rate, :infiltration_schedule_reference, :infiltration_model_coefficient_a, :infiltration_model_coefficient_b, :infiltration_model_coefficient_c, :infiltration_model_coefficient_d, :envelope_status, :lighting_status, :interior_lighting_specification_method, :interior_lighting_power_density_regulated, :interior_lighting_regulated_schedule_reference, :interior_lighting_regulated_heat_gain_space_fraction, :interior_lighting_regulated_heat_gain_radiant_fraction, :interior_lighting_power_density_non_regulated, :interior_lighting_non_regulated_schedule_reference, :interior_lighting_non_regulated_heat_gain_space_fraction, :interior_lighting_non_regulated_heat_gain_radiant_fraction, :skylit_daylighting_installed_lighting_power, :primary_side_daylighting_installed_lighting_power, :secondary_side_daylighting_installed_lighting_power, :skylit100_percent_controlled, :primary_sidelit100_percent_controlled, :secondary_sidelit100_percent_controlled, :skylit_daylighting_reference_point_coordinate, :skylit_daylighting_controlled_lighting_power, :skylit_daylighting_control_lighting_fraction, :skylit_daylighting_illuminance_set_point, :primary_side_daylighting_reference_point_coordinate, :primary_side_daylighting_controlled_lighting_power, :primary_side_daylighting_control_lighting_fraction, :primary_side_daylighting_illuminance_set_point, :secondary_side_daylighting_reference_point_coordinate, :secondary_side_daylighting_controlled_lighting_power, :secondary_side_daylighting_control_lighting_fraction, :secondary_side_daylighting_illuminance_set_point, :daylighting_control_type, :minimum_dimming_light_fraction, :minimum_dimming_power_fraction, :number_of_control_steps, :glare_azimuth, :maximum_glare_index, :skylight_requirement_exception, :skylight_requirement_exception_area, :skylight_requirement_exception_fraction, :receptacle_power_density, :receptacle_schedule_reference, :receptacle_radiation_fraction, :receptacle_latent_fraction, :receptacle_lost_fraction, :gas_equipment_power_density, :gas_equipment_schedule_reference, :gas_equipment_radiation_fraction, :gas_equipment_latent_fraction, :gas_equipment_lost_fraction, :process_electrical_power_density, :process_electrical_schedule_reference, :process_electrical_radiation_fraction, :process_electrical_latent_fraction, :process_electrical_lost_fraction, :process_gas_power_density, :process_gas_schedule_reference, :process_gas_radiation_fraction, :process_gas_latent_fraction, :process_gas_lost_fraction, :commercial_refrigeration_epd, :commercial_refrigeration_equipment_schedule_reference, :commercial_refrigeration_radiation_fraction, :commercial_refrigeration_latent_fraction, :commercial_refrigeration_lost_fraction, :elevator_count, :elevator_power, :elevator_schedule_reference, :elevator_radiation_fraction, :elevator_latent_fraction, :elevator_lost_fraction, :escalator_count, :escalator_power, :escalator_schedule_reference, :escalator_radiation_fraction, :escalator_latent_fraction, :escalator_lost_fraction, :shw_fluid_segment_reference, :recirculation_dhw_system_reference, :hot_water_heating_rate, :recirculation_hot_water_heating_rate, :hot_water_heating_schedule_reference, :ventilation_per_person, :ventilation_per_area, :ventilation_air_changes_per_hour, :ventilation_per_space, :exhaust_per_area, :exhaust_air_changes_per_hour, :exhaust_per_space, :kitchen_exhaust_hood_length, :kitchen_exhaust_hood_style, :kitchen_exhaust_hood_duty, :kitchen_exhaust_hood_flow, :lab_exhaust_rate_type, :interior_lighting_power_density_prescriptive, :is_plenum_return, :high_rise_residential_integer, :high_rise_residential_conditioned_floor_area)
    end
end
