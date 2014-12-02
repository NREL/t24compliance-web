class ExteriorWallsController < ApplicationController
  before_action :set_exterior_wall, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @exterior_walls = ExteriorWall.all
    respond_with(@exterior_walls)
  end

  def show
    respond_with(@exterior_wall)
  end

  def new
    @exterior_wall = ExteriorWall.new
    respond_with(@exterior_wall)
  end

  def edit
  end

  def create
    @exterior_wall = ExteriorWall.new(exterior_wall_params)
    @exterior_wall.save
    respond_with(@exterior_wall)
  end

  def update
    @exterior_wall.update(exterior_wall_params)
    respond_with(@exterior_wall)
  end

  def destroy
    @exterior_wall.destroy
    respond_with(@exterior_wall)
  end

  private
    def set_exterior_wall
      @exterior_wall = ExteriorWall.find(params[:id])
    end

    def exterior_wall_params
      params.require(:exterior_wall).permit(:name, :status, :construct_assembly_reference, :area, :display_perimeter, :azimuth, :exterior_solar_absorptance, :exterior_thermal_absorptance, :exterior_visible_absorptance, :interior_solar_absorptance, :interior_thermal_absorptance, :interior_visible_absorptance)
    end
end
