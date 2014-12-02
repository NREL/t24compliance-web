class InteriorWallsController < ApplicationController
  before_action :set_interior_wall, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @interior_walls = InteriorWall.all
    respond_with(@interior_walls)
  end

  def show
    respond_with(@interior_wall)
  end

  def new
    @interior_wall = InteriorWall.new
    respond_with(@interior_wall)
  end

  def edit
  end

  def create
    @interior_wall = InteriorWall.new(interior_wall_params)
    @interior_wall.save
    respond_with(@interior_wall)
  end

  def update
    @interior_wall.update(interior_wall_params)
    respond_with(@interior_wall)
  end

  def destroy
    @interior_wall.destroy
    respond_with(@interior_wall)
  end

  private
    def set_interior_wall
      @interior_wall = InteriorWall.find(params[:id])
    end

    def interior_wall_params
      params.require(:interior_wall).permit(:name, :status, :adjacent_space_reference, :construct_assembly_reference, :area, :exterior_solar_absorptance, :exterior_thermal_absorptance, :exterior_visible_absorptance, :interior_solar_absorptance, :interior_thermal_absorptance, :interior_visible_absorptance)
    end
end
