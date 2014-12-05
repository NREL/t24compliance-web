class FenestrationConstructionsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :fenestration_construction_params
  before_action :set_fenestration_construction, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @fenestration_constructions = FenestrationConstruction.all
    respond_with(@fenestration_constructions)
  end

  def show
    respond_with(@fenestration_construction)
  end

  def new
    @fenestration_construction = FenestrationConstruction.new
    respond_with(@fenestration_construction)
  end

  def edit
  end

  def create
    @fenestration_construction = FenestrationConstruction.new(fenestration_construction_params)
    @fenestration_construction.save
    respond_with(@fenestration_construction)
  end

  def update
    @fenestration_construction.update(fenestration_construction_params)
    respond_with(@fenestration_construction)
  end

  def destroy
    @fenestration_construction.destroy
    respond_with(@fenestration_construction)
  end

  private
    def set_fenestration_construction
      @fenestration_construction = FenestrationConstruction.find(params[:id])
    end

    def fenestration_construction_params
      params.require(:fenestration_construction).permit(:name, :fenestration_type, :fenestration_product_type, :assembly_context, :certification_method, :skylight_glazing, :skylight_curb, :operable_window_configuration, :greenhouse_garden_window, :fenestration_framing, :fenestration_panes, :glazing_tint, :window_divider, :diffusing, :shgc, :shgc_center_of_glass, :u_factor, :u_factor_center_of_glass, :visible_transmittance, :visible_transmittance_center_of_glass)
    end
end
