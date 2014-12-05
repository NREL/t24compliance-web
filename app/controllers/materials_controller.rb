class MaterialsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :material_params
  before_action :set_material, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @materials = Material.all
    respond_with(@materials)
  end

  def show
    respond_with(@material)
  end

  def new
    @material = Material.new
    respond_with(@material)
  end

  def edit
  end

  def create
    @material = Material.new(material_params)
    @material.save
    respond_with(@material)
  end

  def update
    @material.update(material_params)
    respond_with(@material)
  end

  def destroy
    @material.destroy
    respond_with(@material)
  end

  private
    def set_material
      @material = Material.find(params[:id])
    end

    def material_params
      params.require(:material).permit(:name, :code_category, :code_item, :framing_material, :framing_configuration, :framing_depth, :cavity_insulation, :cavity_insulation_option, :composite_material_notes, :header_insulation, :cmu_weight, :cmu_fill, :spandrel_panel_insulation, :icces_report_number, :insulation_outside_waterproof_membrane)
    end
end
