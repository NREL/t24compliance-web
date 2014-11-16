class InteriorFloorsController < ApplicationController
  before_action :set_interior_floor, only: [:show, :edit, :update, :destroy]

  # GET /interior_floors
  # GET /interior_floors.json
  def index
    @interior_floors = InteriorFloor.all
  end

  # GET /interior_floors/1
  # GET /interior_floors/1.json
  def show
  end

  # GET /interior_floors/new
  def new
    @interior_floor = InteriorFloor.new
  end

  # GET /interior_floors/1/edit
  def edit
  end

  # POST /interior_floors
  # POST /interior_floors.json
  def create
    @interior_floor = InteriorFloor.new(interior_floor_params)

    respond_to do |format|
      if @interior_floor.save
        format.html { redirect_to @interior_floor, notice: 'Interior floor was successfully created.' }
        format.json { render :show, status: :created, location: @interior_floor }
      else
        format.html { render :new }
        format.json { render json: @interior_floor.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /interior_floors/1
  # PATCH/PUT /interior_floors/1.json
  def update
    respond_to do |format|
      if @interior_floor.update(interior_floor_params)
        format.html { redirect_to @interior_floor, notice: 'Interior floor was successfully updated.' }
        format.json { render :show, status: :ok, location: @interior_floor }
      else
        format.html { render :edit }
        format.json { render json: @interior_floor.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /interior_floors/1
  # DELETE /interior_floors/1.json
  def destroy
    @interior_floor.destroy
    respond_to do |format|
      format.html { redirect_to interior_floors_url, notice: 'Interior floor was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_interior_floor
      @interior_floor = InteriorFloor.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def interior_floor_params
      params.require(:interior_floor).permit(:name, :adjacent_space_reference, :construct_assembly_reference, :area)
    end
end
