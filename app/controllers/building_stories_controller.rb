class BuildingStoriesController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :building_story_params
  before_action :set_building_story, only: [:show, :edit, :update, :destroy]
  before_action :get_building
  respond_to :json, :html

  def index
    @building_stories = @building.building_stories
    respond_with(@building_stories)
  end

  def show
    respond_with(@building_story)
  end

  def new
    @building_story = BuildingStory.new
    respond_with(@building_story)
  end

  def edit
  end

  def create
    @building.building_stories.create(building_story_params)
    respond_with(@building.building_stories.where(name: building_story_params[:name]).first)
  end

  def update
    @building_story.update(building_story_params)
    respond_with(@building_story)
  end

  def destroy
    @building_story.destroy
    respond_with(@building_story)
  end

  private
    def set_building_story
      @building_story = BuildingStory.find(params[:id])
    end

    def get_building
      @building = Building.find(params[:building_id])
    end

    def building_story_params
      params.require(:building_story).permit(:name, :multiplier, :z, :floor_to_floor_height, :floor_to_ceiling_height, building_attributes: [:id])
    end
end
