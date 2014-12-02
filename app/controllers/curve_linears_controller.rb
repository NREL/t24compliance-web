class CurveLinearsController < ApplicationController
  before_action :set_curve_linear, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @curve_linears = CurveLinear.all
    respond_with(@curve_linears)
  end

  def show
    respond_with(@curve_linear)
  end

  def new
    @curve_linear = CurveLinear.new
    respond_with(@curve_linear)
  end

  def edit
  end

  def create
    @curve_linear = CurveLinear.new(curve_linear_params)
    @curve_linear.save
    respond_with(@curve_linear)
  end

  def update
    @curve_linear.update(curve_linear_params)
    respond_with(@curve_linear)
  end

  def destroy
    @curve_linear.destroy
    respond_with(@curve_linear)
  end

  private
    def set_curve_linear
      @curve_linear = CurveLinear.find(params[:id])
    end

    def curve_linear_params
      params.require(:curve_linear).permit(:name, :curve_coefficient1, :curve_coefficient2, :curve_maximum_out, :curve_maximum_var1, :curve_minimum_out, :curve_minimum_var1)
    end
end
