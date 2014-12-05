class PolyLoopsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :poly_loop_params
  before_action :set_poly_loop, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @poly_loops = PolyLoop.all
    respond_with(@poly_loops)
  end

  def show
    respond_with(@poly_loop)
  end

  def new
    @poly_loop = PolyLoop.new
    respond_with(@poly_loop)
  end

  def edit
  end

  def create
    @poly_loop = PolyLoop.new(poly_loop_params)
    @poly_loop.save
    respond_with(@poly_loop)
  end

  def update
    @poly_loop.update(poly_loop_params)
    respond_with(@poly_loop)
  end

  def destroy
    @poly_loop.destroy
    respond_with(@poly_loop)
  end

  private
    def set_poly_loop
      @poly_loop = PolyLoop.find(params[:id])
    end

    def poly_loop_params
      params.require(:poly_loop).permit(:name)
    end
end
