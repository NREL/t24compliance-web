class BuildingStoriesController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource
  before_action :set_building_story, only: [:show, :edit, :update, :destroy]
  before_action :get_building, only: [:index, :update, :create]
  respond_to :json, :html

  def index
    @building_stories = (@building.present?) ? @building.building_stories : []
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
    @building_story.update(building_story_params)
    respond_with(@building_story)
  end

  # OVERWRITING CREATE AS BULK UPDATE
  def create
    clean_params = building_stories_params
    logger.info("CLEAN PARAMS: #{clean_params.inspect}")

    # add / update
    stories = []
    if clean_params.has_key?('_json')
      clean_params[:_json].each do |rec|
        logger.info("REC: #{rec.inspect}")
        if rec.has_key?('id') and !rec['id'].nil?

          @story = BuildingStory.find(rec['id'])
          @story.update(rec)
          stories << @story
        else
          @story = BuildingStory.new(rec)
          @story.save
          stories << @story
        end
      end
    end

    # delete ?
    @building.building_stories = stories
    @building.save

    # TODO: add error handling?
    # TODO: couldn't get this to respond with index action...
    respond_with stories.first || BuildingStory.new

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
      @building = Building.where(:id => params[:building_id]).first
    end

    # def building_story_params
    #   params.require(:building_story).permit(:name, :multiplier, :z, :floor_to_floor_height, :floor_to_ceiling_height, :building_id)
    # end

    #for update_all
    def building_stories_params
      params.permit(:building_id, _json: [:id, :name, :multiplier, :z, :floor_to_floor_height, :floor_to_ceiling_height, :building_id])
    end
end
