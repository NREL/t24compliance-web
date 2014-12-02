class BuildingStoriesController < ApplicationController
  before_action :set_building_story, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @building_stories = BuildingStory.all
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
    @building_story = BuildingStory.new(building_story_params)
    @building_story.save
    respond_with(@building_story)
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

    def building_story_params
      params.require(:building_story).permit(:name, :multiplier, :z, :floor_to_floor_height, :floor_to_ceiling_height)
    end
end
