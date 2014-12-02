class InteriorFloorsController < ApplicationController
  before_action :set_interior_floor, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @interior_floors = InteriorFloor.all
    respond_with(@interior_floors)
  end

  def show
    respond_with(@interior_floor)
  end

  def new
    @interior_floor = InteriorFloor.new
    respond_with(@interior_floor)
  end

  def edit
  end

  def create
    @interior_floor = InteriorFloor.new(interior_floor_params)
    @interior_floor.save
    respond_with(@interior_floor)
  end

  def update
    @interior_floor.update(interior_floor_params)
    respond_with(@interior_floor)
  end

  def destroy
    @interior_floor.destroy
    respond_with(@interior_floor)
  end

  private
    def set_interior_floor
      @interior_floor = InteriorFloor.find(params[:id])
    end

    def interior_floor_params
      params.require(:interior_floor).permit(:name, :adjacent_space_reference, :construct_assembly_reference, :area, :interior_solar_absorptance, :interior_thermal_absorptance, :interior_visible_absorptance)
    end
end
