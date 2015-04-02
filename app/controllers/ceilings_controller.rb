class CeilingsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :ceiling_params
  before_action :set_ceiling, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @ceilings = Ceiling.all
    respond_with(@ceilings)
  end

  def show
    respond_with(@ceiling)
  end

  def new
    @ceiling = Ceiling.new
    respond_with(@ceiling)
  end

  def edit
  end

  def create
    @ceiling = Ceiling.new(ceiling_params)
    @ceiling.save
    respond_with(@ceiling)
  end

  def update
    @ceiling.update(ceiling_params)
    respond_with(@ceiling)
  end

  def destroy
    @ceiling.destroy
    respond_with(@ceiling)
  end

  private

  def set_ceiling
    @ceiling = Ceiling.find(params[:id])
  end

  def ceiling_params
    params.require(:ceiling).permit(:name, :area, :adjacent_space_reference, :construct_assembly_reference, :exterior_solar_absorptance, :exterior_thermal_absorptance, :exterior_visible_absorptance, :interior_solar_absorptance, :interior_thermal_absorptance, :interior_visible_absorptance)
  end
end
