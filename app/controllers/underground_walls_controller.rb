class UndergroundWallsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :underground_wall_params
  before_action :set_underground_wall, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @underground_walls = UndergroundWall.all
    respond_with(@underground_walls)
  end

  def show
    respond_with(@underground_wall)
  end

  def new
    @underground_wall = UndergroundWall.new
    respond_with(@underground_wall)
  end

  def edit
  end

  def create
    @underground_wall = UndergroundWall.new(underground_wall_params)
    @underground_wall.save
    respond_with(@underground_wall)
  end

  def update
    @underground_wall.update(underground_wall_params)
    respond_with(@underground_wall)
  end

  def destroy
    @underground_wall.destroy
    respond_with(@underground_wall)
  end

  private

  def set_underground_wall
    @underground_wall = UndergroundWall.find(params[:id])
  end

  def underground_wall_params
    params.require(:underground_wall).permit(:name, :status, :construct_assembly_reference, :area, :height, :interior_solar_absorptance, :interior_thermal_absorptance, :interior_visible_absorptance)
  end
end
