class ConstructionDefaultsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_construction_default, only: [:show, :edit, :update, :destroy]
  before_action :get_project
  load_and_authorize_resource :project # the resource is project

  respond_to :json, :html

  # angular using only: index, create

  def index
    defaults = (@project.construction_default.present?) ? [@project.construction_default] : []
    respond_with(defaults)
  end

  def create
    @project.construction_default = ConstructionDefault.new(construction_default_params)
    @project.construction_default.save
    respond_with(@project.construction_default)
  end

  def show
    @project.construction_default
    respond_with(@project.construction_default)
  end

  def new
    @construction_default = ConstructionDefault.new
    respond_with(@construction_default)
  end

  def edit
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
    params.require(:construction_default).permit(:exterior_wall, :interior_wall, :underground_wall, :roof, :door, :window, :skylight, :exterior_floor, :interior_floor, :underground_floor, :project_id)
  end
end
