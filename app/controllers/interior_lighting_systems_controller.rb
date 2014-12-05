class InteriorLightingSystemsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :interior_lighting_system_params
  before_action :set_interior_lighting_system, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @interior_lighting_systems = InteriorLightingSystem.all
    respond_with(@interior_lighting_systems)
  end

  def show
    respond_with(@interior_lighting_system)
  end

  def new
    @interior_lighting_system = InteriorLightingSystem.new
    respond_with(@interior_lighting_system)
  end

  def edit
  end

  def create
    @interior_lighting_system = InteriorLightingSystem.new(interior_lighting_system_params)
    @interior_lighting_system.save
    respond_with(@interior_lighting_system)
  end

  def update
    @interior_lighting_system.update(interior_lighting_system_params)
    respond_with(@interior_lighting_system)
  end

  def destroy
    @interior_lighting_system.destroy
    respond_with(@interior_lighting_system)
  end

  private
    def set_interior_lighting_system
      @interior_lighting_system = InteriorLightingSystem.find(params[:id])
    end

    def interior_lighting_system_params
      params.require(:interior_lighting_system).permit(:name, :status, :parent_space_function, :schedule_reference, :power_regulated, :non_regulated_exclusion, :luminaire_reference, :luminaire_count, :area_category_allowance_type, :allowance_length, :allowance_area, :tailored_method_allowance_type, :power_adjustment_factor_credit_type, :interior_lighting_specification_method, :luminaire_mounting_height, :work_plane_height, :daylit_area_type)
    end
end
