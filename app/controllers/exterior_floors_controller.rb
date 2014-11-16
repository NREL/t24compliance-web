class ExteriorFloorsController < ApplicationController
  before_action :set_exterior_floor, only: [:show, :edit, :update, :destroy]

  # GET /exterior_floors
  # GET /exterior_floors.json
  def index
    @exterior_floors = ExteriorFloor.all
  end

  # GET /exterior_floors/1
  # GET /exterior_floors/1.json
  def show
  end

  # GET /exterior_floors/new
  def new
    @exterior_floor = ExteriorFloor.new
  end

  # GET /exterior_floors/1/edit
  def edit
  end

  # POST /exterior_floors
  # POST /exterior_floors.json
  def create
    @exterior_floor = ExteriorFloor.new(exterior_floor_params)

    respond_to do |format|
      if @exterior_floor.save
        format.html { redirect_to @exterior_floor, notice: 'Exterior floor was successfully created.' }
        format.json { render :show, status: :created, location: @exterior_floor }
      else
        format.html { render :new }
        format.json { render json: @exterior_floor.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /exterior_floors/1
  # PATCH/PUT /exterior_floors/1.json
  def update
    respond_to do |format|
      if @exterior_floor.update(exterior_floor_params)
        format.html { redirect_to @exterior_floor, notice: 'Exterior floor was successfully updated.' }
        format.json { render :show, status: :ok, location: @exterior_floor }
      else
        format.html { render :edit }
        format.json { render json: @exterior_floor.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /exterior_floors/1
  # DELETE /exterior_floors/1.json
  def destroy
    @exterior_floor.destroy
    respond_to do |format|
      format.html { redirect_to exterior_floors_url, notice: 'Exterior floor was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_exterior_floor
      @exterior_floor = ExteriorFloor.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def exterior_floor_params
      params.require(:exterior_floor).permit(:name, :status, :area)
    end
end
