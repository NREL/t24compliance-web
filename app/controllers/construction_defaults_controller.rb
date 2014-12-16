class ConstructionDefaultsController < ApplicationController
  before_action :set_construction_default, only: [:show, :edit, :update, :destroy]
  before_action :get_project

  respond_to :json, :html

  def index
    if @project
      @construction_defaults = []
      @construction_defaults << @project.construction_default
    else
      @construction_defaults = ConstructionDefault.all
    end
    respond_with(@construction_defaults)
  end

  def show
    respond_with(@construction_default)
  end

  def new
    @construction_default = ConstructionDefault.new
    respond_with(@construction_default)
  end

  def edit
  end

  def create
    @project.construction_default = ConstructionDefault.new(construction_default_params)
    @project.construction_default.save
    respond_with(@project.construction_default)
  end

  def update
    @construction_default.update(construction_default_params)
    respond_with(@construction_default)
  end

  def destroy
    @construction_default.destroy
    respond_with(@construction_default)
  end

  private
    def set_construction_default
      @construction_default = ConstructionDefault.find(params[:id])
    end

  def get_project
    @project = Project.find(params[:project_id])
  end

    def construction_default_params
      params.require(:construction_default).permit(:external_wall, :internal_wall, :roof, :window, :skylight, :raised_floor, :slab_on_grade, project_attributes: [:id])
    end
end
