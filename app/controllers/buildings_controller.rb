class BuildingsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :building_params
  before_action :set_building, only: [:edit, :update, :destroy]
  before_action :get_project

  respond_to :json, :html

  def index
    # index should return array, even though we only have 1 building / project
    Rails.logger.debug "in buildings index"
    res = []
    res << @project.building
    Rails.logger.debug "res = #{res.inspect}"
    respond_with(res)
  end

  def show
    respond_with(@project.building)
  end

  def new
    @project.building = Building.new
    @building = @project.building
    respond_with(@project, @building)
  end

  def edit
  end

  def create
    @project.building = Building.new(building_params)
    @building = @project.building
    @project.building.save
    respond_with(@project, @building)
  end

  def update
    @building.update(building_params)
    respond_with(@building)
  end

  def destroy
    @project.building.destroy
    respond_with(@project.building)
  end

  private
    def set_building
      @building = Building.find(params[:id])
    end

    def get_project
      @project = Project.find(params[:project_id])
    end

    def building_params
      params.require(:building).permit(:name, :function_classification_method, :relocatable_public_school_building, :whole_building_modeled, :building_azimuth, :total_story_count, :total_story_count_new, :total_story_count_existing, :total_story_count_altered, :above_grade_story_count, :above_grade_story_count_new, :above_grade_story_count_existing, :above_grade_story_count_altered, :living_unit_count, :living_unit_count_new, :living_unit_count_existing, :living_unit_count_altered, :total_floor_area, :nonresidential_floor_area, :residential_floor_area, :total_conditioned_volume, :plant_cooling_capacity, :plant_heating_capacity, :coil_cooling_capacity, :coil_heating_capacity, :project_id)
    end
end
