class BuildingsController < ApplicationController
  before_action :set_building, only: [:show, :edit, :update, :destroy]

  # GET /buildings
  # GET /buildings.json
  def index
    @buildings = Building.all
  end

  # GET /buildings/1
  # GET /buildings/1.json
  def show
  end

  # GET /buildings/new
  def new
    @building = Building.new
  end

  # GET /buildings/1/edit
  def edit
  end

  # POST /buildings
  # POST /buildings.json
  def create
    @building = Building.new(building_params)

    respond_to do |format|
      if @building.save
        format.html { redirect_to @building, notice: 'Building was successfully created.' }
        format.json { render :show, status: :created, location: @building }
      else
        format.html { render :new }
        format.json { render json: @building.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /buildings/1
  # PATCH/PUT /buildings/1.json
  def update
    respond_to do |format|
      if @building.update(building_params)
        format.html { redirect_to @building, notice: 'Building was successfully updated.' }
        format.json { render :show, status: :ok, location: @building }
      else
        format.html { render :edit }
        format.json { render json: @building.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /buildings/1
  # DELETE /buildings/1.json
  def destroy
    @building.destroy
    respond_to do |format|
      format.html { redirect_to buildings_url, notice: 'Building was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_building
      @building = Building.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def building_params
      params.require(:building).permit(:name, :function_classification_method, :relocatable_public_school_building, :building_azimuth, :total_story_count, :above_grade_story_count, :living_unit_count, :total_floor_area, :nonresidential_floor_area, :residential_floor_area, :total_conditioned_volume, :plant_cooling_capacity, :plant_heating_capacity, :coil_cooling_capacity, :coil_heating_capacity)
    end
end
