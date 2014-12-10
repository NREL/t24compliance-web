class ConstructionDefaultsController < ApplicationController
  before_action :set_construction_default, only: [:show, :edit, :update, :destroy]

  respond_to :json, :html

  def index
    @construction_defaults = ConstructionDefault.all
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
    @construction_default = ConstructionDefault.new(construction_default_params)
    @construction_default.save
    respond_with(@construction_default)
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

    def construction_default_params
      params.require(:construction_default).permit(:external_wall, :internal_wall, :roof, :window, :skylight, :raised_floor, :slab_on_grade)
    end
end
