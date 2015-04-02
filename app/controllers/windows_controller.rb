class WindowsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :window_params
  before_action :set_window, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @windows = Window.all
    respond_with(@windows)
  end

  def show
    respond_with(@window)
  end

  def new
    @window = Window.new
    respond_with(@window)
  end

  def edit
  end

  def create
    @window = Window.new(window_params)
    @window.save
    respond_with(@window)
  end

  def update
    @window.update(window_params)
    respond_with(@window)
  end

  def destroy
    @window.destroy
    respond_with(@window)
  end

  private

  def set_window
    @window = Window.find(params[:id])
  end

  def window_params
    params.require(:window).permit(:name, :status, :fenestration_construction_reference, :area)
  end
end
