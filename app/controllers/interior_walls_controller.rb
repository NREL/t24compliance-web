class InteriorWallsController < ApplicationController
  before_action :set_interior_wall, only: [:show, :edit, :update, :destroy]

  # GET /interior_walls
  # GET /interior_walls.json
  def index
    @interior_walls = InteriorWall.all
  end

  # GET /interior_walls/1
  # GET /interior_walls/1.json
  def show
  end

  # GET /interior_walls/new
  def new
    @interior_wall = InteriorWall.new
  end

  # GET /interior_walls/1/edit
  def edit
  end

  # POST /interior_walls
  # POST /interior_walls.json
  def create
    @interior_wall = InteriorWall.new(interior_wall_params)

    respond_to do |format|
      if @interior_wall.save
        format.html { redirect_to @interior_wall, notice: 'Interior wall was successfully created.' }
        format.json { render :show, status: :created, location: @interior_wall }
      else
        format.html { render :new }
        format.json { render json: @interior_wall.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /interior_walls/1
  # PATCH/PUT /interior_walls/1.json
  def update
    respond_to do |format|
      if @interior_wall.update(interior_wall_params)
        format.html { redirect_to @interior_wall, notice: 'Interior wall was successfully updated.' }
        format.json { render :show, status: :ok, location: @interior_wall }
      else
        format.html { render :edit }
        format.json { render json: @interior_wall.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /interior_walls/1
  # DELETE /interior_walls/1.json
  def destroy
    @interior_wall.destroy
    respond_to do |format|
      format.html { redirect_to interior_walls_url, notice: 'Interior wall was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_interior_wall
      @interior_wall = InteriorWall.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def interior_wall_params
      params.require(:interior_wall).permit(:name, :status, :adjacent_space_reference, :construct_assembly_reference, :area)
    end
end
