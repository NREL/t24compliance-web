class BuildingStoriesController < ApplicationController
  before_action :set_building_story, only: [:show, :edit, :update, :destroy]

  # GET /building_stories
  # GET /building_stories.json
  def index
    @building_stories = BuildingStory.all
  end

  # GET /building_stories/1
  # GET /building_stories/1.json
  def show
  end

  # GET /building_stories/new
  def new
    @building_story = BuildingStory.new
  end

  # GET /building_stories/1/edit
  def edit
  end

  # POST /building_stories
  # POST /building_stories.json
  def create
    @building_story = BuildingStory.new(building_story_params)

    respond_to do |format|
      if @building_story.save
        format.html { redirect_to @building_story, notice: 'Building story was successfully created.' }
        format.json { render :show, status: :created, location: @building_story }
      else
        format.html { render :new }
        format.json { render json: @building_story.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /building_stories/1
  # PATCH/PUT /building_stories/1.json
  def update
    respond_to do |format|
      if @building_story.update(building_story_params)
        format.html { redirect_to @building_story, notice: 'Building story was successfully updated.' }
        format.json { render :show, status: :ok, location: @building_story }
      else
        format.html { render :edit }
        format.json { render json: @building_story.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /building_stories/1
  # DELETE /building_stories/1.json
  def destroy
    @building_story.destroy
    respond_to do |format|
      format.html { redirect_to building_stories_url, notice: 'Building story was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_building_story
      @building_story = BuildingStory.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def building_story_params
      params.require(:building_story).permit(:name, :multiplier, :z, :floor_to_floor_height, :floor_to_ceiling_height)
    end
end
