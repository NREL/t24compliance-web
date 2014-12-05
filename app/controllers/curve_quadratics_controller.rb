class CurveQuadraticsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :curve_quadratic_params
  before_action :set_curve_quadratic, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @curve_quadratics = CurveQuadratic.all
    respond_with(@curve_quadratics)
  end

  def show
    respond_with(@curve_quadratic)
  end

  def new
    @curve_quadratic = CurveQuadratic.new
    respond_with(@curve_quadratic)
  end

  def edit
  end

  def create
    @curve_quadratic = CurveQuadratic.new(curve_quadratic_params)
    @curve_quadratic.save
    respond_with(@curve_quadratic)
  end

  def update
    @curve_quadratic.update(curve_quadratic_params)
    respond_with(@curve_quadratic)
  end

  def destroy
    @curve_quadratic.destroy
    respond_with(@curve_quadratic)
  end

  private
    def set_curve_quadratic
      @curve_quadratic = CurveQuadratic.find(params[:id])
    end

    def curve_quadratic_params
      params.require(:curve_quadratic).permit(:name, :curve_coefficient1, :curve_coefficient2, :curve_coefficient3, :curve_maximum_out, :curve_maximum_var1, :curve_minimum_out, :curve_minimum_var1)
    end
end
