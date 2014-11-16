class ExteriorWallsController < ApplicationController
  before_action :set_exterior_wall, only: [:show, :edit, :update, :destroy]

  # GET /exterior_walls
  # GET /exterior_walls.json
  def index
    @exterior_walls = ExteriorWall.all
  end

  # GET /exterior_walls/1
  # GET /exterior_walls/1.json
  def show
  end

  # GET /exterior_walls/new
  def new
    @exterior_wall = ExteriorWall.new
  end

  # GET /exterior_walls/1/edit
  def edit
  end

  # POST /exterior_walls
  # POST /exterior_walls.json
  def create
    @exterior_wall = ExteriorWall.new(exterior_wall_params)

    respond_to do |format|
      if @exterior_wall.save
        format.html { redirect_to @exterior_wall, notice: 'Exterior wall was successfully created.' }
        format.json { render :show, status: :created, location: @exterior_wall }
      else
        format.html { render :new }
        format.json { render json: @exterior_wall.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /exterior_walls/1
  # PATCH/PUT /exterior_walls/1.json
  def update
    respond_to do |format|
      if @exterior_wall.update(exterior_wall_params)
        format.html { redirect_to @exterior_wall, notice: 'Exterior wall was successfully updated.' }
        format.json { render :show, status: :ok, location: @exterior_wall }
      else
        format.html { render :edit }
        format.json { render json: @exterior_wall.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /exterior_walls/1
  # DELETE /exterior_walls/1.json
  def destroy
    @exterior_wall.destroy
    respond_to do |format|
      format.html { redirect_to exterior_walls_url, notice: 'Exterior wall was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_exterior_wall
      @exterior_wall = ExteriorWall.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def exterior_wall_params
      params.require(:exterior_wall).permit(:name, :status, :area)
    end
end
