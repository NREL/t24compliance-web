class RecirculationDhwSystemsController < ApplicationController
  before_action :set_recirculation_dhw_system, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @recirculation_dhw_systems = RecirculationDhwSystem.all
    respond_with(@recirculation_dhw_systems)
  end

  def show
    respond_with(@recirculation_dhw_system)
  end

  def new
    @recirculation_dhw_system = RecirculationDhwSystem.new
    respond_with(@recirculation_dhw_system)
  end

  def edit
  end

  def create
    @recirculation_dhw_system = RecirculationDhwSystem.new(recirculation_dhw_system_params)
    @recirculation_dhw_system.save
    respond_with(@recirculation_dhw_system)
  end

  def update
    @recirculation_dhw_system.update(recirculation_dhw_system_params)
    respond_with(@recirculation_dhw_system)
  end

  def destroy
    @recirculation_dhw_system.destroy
    respond_with(@recirculation_dhw_system)
  end

  private
    def set_recirculation_dhw_system
      @recirculation_dhw_system = RecirculationDhwSystem.find(params[:id])
    end

    def recirculation_dhw_system_params
      params.require(:recirculation_dhw_system).permit(:name, :status, :type, :multiplier, :central_system, :distribution_type, :pump_power, :pump_efficiency, :system_story_count, :living_unit_count, :water_heater_count, :total_input_rating, :total_tank_volume, :baseline_recirculation_water_heater_reference, :use_default_loops, :pipe_length, :pipe_diameter, :pipe_location, :loop_count, :pipe_extra_insulation, :annual_solar_fraction)
    end
end
