class ExteriorFloorsController < ApplicationController
  before_action :set_exterior_floor, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @exterior_floors = ExteriorFloor.all
    respond_with(@exterior_floors)
  end

  def show
    respond_with(@exterior_floor)
  end

  def new
    @exterior_floor = ExteriorFloor.new
    respond_with(@exterior_floor)
  end

  def edit
  end

  def create
    @exterior_floor = ExteriorFloor.new(exterior_floor_params)
    @exterior_floor.save
    respond_with(@exterior_floor)
  end

  def update
    @exterior_floor.update(exterior_floor_params)
    respond_with(@exterior_floor)
  end

  def destroy
    @exterior_floor.destroy
    respond_with(@exterior_floor)
  end

  private
    def set_exterior_floor
      @exterior_floor = ExteriorFloor.find(params[:id])
    end

    def exterior_floor_params
      params.require(:exterior_floor).permit(:name, :status, :construct_assembly_reference, :area, :exterior_solar_absorptance, :exterior_thermal_absorptance, :exterior_visible_absorptance, :interior_solar_absorptance, :interior_thermal_absorptance, :interior_visible_absorptance)
    end
end
