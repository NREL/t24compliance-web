class DoorsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :door_params
  before_action :set_door, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @doors = Door.all
    respond_with(@doors)
  end

  def show
    respond_with(@door)
  end

  def new
    @door = Door.new
    respond_with(@door)
  end

  def edit
  end

  def create
    @door = Door.new(door_params)
    @door.save
    respond_with(@door)
  end

  def update
    @door.update(door_params)
    respond_with(@door)
  end

  def destroy
    @door.destroy
    respond_with(@door)
  end

  private
    def set_door
      @door = Door.find(params[:id])
    end

    def door_params
      params.require(:door).permit(:name, :status, :operation, :door_construction_reference, :area)
    end
end
