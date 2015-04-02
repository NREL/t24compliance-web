class ConstructAssembliesController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :construct_assembly_params
  before_action :set_construct_assembly, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @construct_assemblies = ConstructAssembly.all
    respond_with(@construct_assemblies)
  end

  def show
    respond_with(@construct_assembly)
  end

  def new
    @construct_assembly = ConstructAssembly.new
    respond_with(@construct_assembly)
  end

  def edit
  end

  def create
    @construct_assembly = ConstructAssembly.new(construct_assembly_params)
    @construct_assembly.save
    respond_with(@construct_assembly)
  end

  def update
    @construct_assembly.update(construct_assembly_params)
    respond_with(@construct_assembly)
  end

  def destroy
    @construct_assembly.destroy
    respond_with(@construct_assembly)
  end

  private

  def set_construct_assembly
    @construct_assembly = ConstructAssembly.find(params[:id])
  end

  def construct_assembly_params
    params.require(:construct_assembly).permit(:name, :compatible_surface_type, :exterior_solar_absorptance, :exterior_thermal_absorptance, :exterior_visible_absorptance, :interior_solar_absorptance, :interior_thermal_absorptance, :interior_visible_absorptance, :slab_type, :slab_insulation_orientation, :slab_insulation_thermal_resistance, :field_applied_coating, :crrc_initial_reflectance, :crrc_aged_reflectance, :crrc_initial_emittance, :crrc_aged_emittance, :crrc_initial_sri, :crrc_aged_sri, :crrc_product_id, :material_reference)
  end
end
