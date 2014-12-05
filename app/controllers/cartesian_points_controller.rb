class CartesianPointsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :cartesian_point_params
  before_action :set_cartesian_point, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @cartesian_points = CartesianPoint.all
    respond_with(@cartesian_points)
  end

  def show
    respond_with(@cartesian_point)
  end

  def new
    @cartesian_point = CartesianPoint.new
    respond_with(@cartesian_point)
  end

  def edit
  end

  def create
    @cartesian_point = CartesianPoint.new(cartesian_point_params)
    @cartesian_point.save
    respond_with(@cartesian_point)
  end

  def update
    @cartesian_point.update(cartesian_point_params)
    respond_with(@cartesian_point)
  end

  def destroy
    @cartesian_point.destroy
    respond_with(@cartesian_point)
  end

  private
    def set_cartesian_point
      @cartesian_point = CartesianPoint.find(params[:id])
    end

    def cartesian_point_params
      params.require(:cartesian_point).permit(:name, :coordinate)
    end
end
