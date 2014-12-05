class CurveCubicsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :curve_cubic_params
  before_action :set_curve_cubic, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @curve_cubics = CurveCubic.all
    respond_with(@curve_cubics)
  end

  def show
    respond_with(@curve_cubic)
  end

  def new
    @curve_cubic = CurveCubic.new
    respond_with(@curve_cubic)
  end

  def edit
  end

  def create
    @curve_cubic = CurveCubic.new(curve_cubic_params)
    @curve_cubic.save
    respond_with(@curve_cubic)
  end

  def update
    @curve_cubic.update(curve_cubic_params)
    respond_with(@curve_cubic)
  end

  def destroy
    @curve_cubic.destroy
    respond_with(@curve_cubic)
  end

  private
    def set_curve_cubic
      @curve_cubic = CurveCubic.find(params[:id])
    end

    def curve_cubic_params
      params.require(:curve_cubic).permit(:name, :curve_coefficient1, :curve_coefficient2, :curve_coefficient3, :curve_coefficient4, :curve_maximum_out, :curve_maximum_var1, :curve_minimum_out, :curve_minimum_var1)
    end
end
