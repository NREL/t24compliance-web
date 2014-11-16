class DoorConstructionsController < ApplicationController
  before_action :set_door_construction, only: [:show, :edit, :update, :destroy]

  # GET /door_constructions
  # GET /door_constructions.json
  def index
    @door_constructions = DoorConstruction.all
  end

  # GET /door_constructions/1
  # GET /door_constructions/1.json
  def show
  end

  # GET /door_constructions/new
  def new
    @door_construction = DoorConstruction.new
  end

  # GET /door_constructions/1/edit
  def edit
  end

  # POST /door_constructions
  # POST /door_constructions.json
  def create
    @door_construction = DoorConstruction.new(door_construction_params)

    respond_to do |format|
      if @door_construction.save
        format.html { redirect_to @door_construction, notice: 'Door construction was successfully created.' }
        format.json { render :show, status: :created, location: @door_construction }
      else
        format.html { render :new }
        format.json { render json: @door_construction.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /door_constructions/1
  # PATCH/PUT /door_constructions/1.json
  def update
    respond_to do |format|
      if @door_construction.update(door_construction_params)
        format.html { redirect_to @door_construction, notice: 'Door construction was successfully updated.' }
        format.json { render :show, status: :ok, location: @door_construction }
      else
        format.html { render :edit }
        format.json { render json: @door_construction.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /door_constructions/1
  # DELETE /door_constructions/1.json
  def destroy
    @door_construction.destroy
    respond_to do |format|
      format.html { redirect_to door_constructions_url, notice: 'Door construction was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_door_construction
      @door_construction = DoorConstruction.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def door_construction_params
      params.require(:door_construction).permit(:name, :type)
    end
end
