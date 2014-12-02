class SkylightsController < ApplicationController
  before_action :set_skylight, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @skylights = Skylight.all
    respond_with(@skylights)
  end

  def show
    respond_with(@skylight)
  end

  def new
    @skylight = Skylight.new
    respond_with(@skylight)
  end

  def edit
  end

  def create
    @skylight = Skylight.new(skylight_params)
    @skylight.save
    respond_with(@skylight)
  end

  def update
    @skylight.update(skylight_params)
    respond_with(@skylight)
  end

  def destroy
    @skylight.destroy
    respond_with(@skylight)
  end

  private
    def set_skylight
      @skylight = Skylight.find(params[:id])
    end

    def skylight_params
      params.require(:skylight).permit(:name, :status, :fenestration_construction_reference, :area)
    end
end
