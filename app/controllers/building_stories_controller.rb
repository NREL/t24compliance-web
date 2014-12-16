class BuildingStoriesController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource
  before_action :set_building_story, only: [:show, :edit, :update, :destroy]
  before_action :get_building, only: [:index, :update]
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

  def update

    logger.info("HI!")
    @building_story.update(building_story_params)
    respond_with(@building_story)
  end

  # OVERWRITING CREATE AS BULK UPDATE
  def create
    clean_params = building_stories_params
    logger.info("CLEAN PARAMS: #{clean_params.inspect}")

    # original set
    # stories = @building.building_stories.only(:id)
    # logger.info("stored stories ids: #{stories}")

    # new set
    # new_stories = clean_params.collect{ |s| s[:id] }
    # logger.info("new stories ids: #{new_stories}")

    # add / update
    clean_params[:_json].each do |rec|
      logger.info("REC: #{rec.inspect}")
      if rec.has_key?('id') and !rec['id'].nil?

        @story = BuildingStory.find(rec['id'])
        @building = @story.building
        @story.update(rec)
      else
        @story = BuildingStory.new(rec)
        @story.save
      end
    end

     @building_stories = @building.building_stories

    # delete

    # TODO: add error handling?
    # TODO: couldn't get this to respond with index action...
    respond_with(@story)

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

    # def building_story_params
    #   params.require(:building_story).permit(:name, :multiplier, :z, :floor_to_floor_height, :floor_to_ceiling_height, :building_id)
    # end

    #for update_all
    def building_stories_params
      params.permit(_json: [:id, :name, :multiplier, :z, :floor_to_floor_height, :floor_to_ceiling_height, :building_id])
    end
end
