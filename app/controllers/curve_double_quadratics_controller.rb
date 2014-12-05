class CurveDoubleQuadraticsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :curve_double_quadratic_params
  before_action :set_curve_double_quadratic, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @curve_double_quadratics = CurveDoubleQuadratic.all
    respond_with(@curve_double_quadratics)
  end

  def show
    respond_with(@curve_double_quadratic)
  end

  def new
    @curve_double_quadratic = CurveDoubleQuadratic.new
    respond_with(@curve_double_quadratic)
  end

  def edit
  end

  def create
    @curve_double_quadratic = CurveDoubleQuadratic.new(curve_double_quadratic_params)
    @curve_double_quadratic.save
    respond_with(@curve_double_quadratic)
  end

  def update
    @curve_double_quadratic.update(curve_double_quadratic_params)
    respond_with(@curve_double_quadratic)
  end

  def destroy
    @curve_double_quadratic.destroy
    respond_with(@curve_double_quadratic)
  end

  private
    def set_curve_double_quadratic
      @curve_double_quadratic = CurveDoubleQuadratic.find(params[:id])
    end

    def curve_double_quadratic_params
      params.require(:curve_double_quadratic).permit(:name, :curve_coefficient1, :curve_coefficient2, :curve_coefficient3, :curve_coefficient4, :curve_coefficient5, :curve_coefficient6, :curve_maximum_out, :curve_maximum_var1, :curve_maximum_var2, :curve_minimum_out, :curve_minimum_var1, :curve_minimum_var2)
    end
end
