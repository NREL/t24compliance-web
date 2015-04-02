class RoofsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :roof_params
  before_action :set_roof, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @roofs = Roof.all
    respond_with(@roofs)
  end

  def show
    respond_with(@roof)
  end

  def new
    @roof = Roof.new
    respond_with(@roof)
  end

  def edit
  end

  def create
    @roof = Roof.new(roof_params)
    @roof.save
    respond_with(@roof)
  end

  def update
    @roof.update(roof_params)
    respond_with(@roof)
  end

  def destroy
    @roof.destroy
    respond_with(@roof)
  end

  private

  def set_roof
    @roof = Roof.find(params[:id])
  end

  def roof_params
    params.require(:roof).permit(:name, :status, :construct_assembly_reference, :area, :azimuth, :tilt, :interior_solar_absorptance, :interior_thermal_absorptance, :interior_visible_absorptance, :field_applied_coating, :crrc_initial_reflectance, :crrc_aged_reflectance, :crrc_initial_emittance, :crrc_aged_emittance, :crrc_initial_sri, :crrc_aged_sri, :crrc_product_id)
  end
end
