class UndergroundFloorsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :underground_floor_params
  before_action :set_underground_floor, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @underground_floors = UndergroundFloor.all
    respond_with(@underground_floors)
  end

  def show
    respond_with(@underground_floor)
  end

  def new
    @underground_floor = UndergroundFloor.new
    respond_with(@underground_floor)
  end

  def edit
  end

  def create
    @underground_floor = UndergroundFloor.new(underground_floor_params)
    @underground_floor.save
    respond_with(@underground_floor)
  end

  def update
    @underground_floor.update(underground_floor_params)
    respond_with(@underground_floor)
  end

  def destroy
    @underground_floor.destroy
    respond_with(@underground_floor)
  end

  private
    def set_underground_floor
      @underground_floor = UndergroundFloor.find(params[:id])
    end

    def underground_floor_params
      params.require(:underground_floor).permit(:name, :status, :construct_assembly_reference, :area, :perimeter_exposed, :interior_solar_absorptance, :interior_thermal_absorptance, :interior_visible_absorptance)
    end
end
