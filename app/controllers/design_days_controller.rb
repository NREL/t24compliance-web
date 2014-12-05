class DesignDaysController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :design_day_params
  before_action :set_design_day, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @design_days = DesignDay.all
    respond_with(@design_days)
  end

  def show
    respond_with(@design_day)
  end

  def new
    @design_day = DesignDay.new
    respond_with(@design_day)
  end

  def edit
  end

  def create
    @design_day = DesignDay.new(design_day_params)
    @design_day.save
    respond_with(@design_day)
  end

  def update
    @design_day.update(design_day_params)
    respond_with(@design_day)
  end

  def destroy
    @design_day.destroy
    respond_with(@design_day)
  end

  private
    def set_design_day
      @design_day = DesignDay.find(params[:id])
    end

    def design_day_params
      params.require(:design_day).permit(:name, :type, :design_dry_bulb, :design_dry_bulb_range, :coincident_wet_bulb, :wind_speed, :wind_direction, :sky_clearness, :month, :month_day)
    end
end
