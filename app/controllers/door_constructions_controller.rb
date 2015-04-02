class DoorConstructionsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :door_construction_params
  before_action :set_door_construction, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @door_constructions = DoorConstruction.all
    respond_with(@door_constructions)
  end

  def show
    respond_with(@door_construction)
  end

  def new
    @door_construction = DoorConstruction.new
    respond_with(@door_construction)
  end

  def edit
  end

  def create
    @door_construction = DoorConstruction.new(door_construction_params)
    @door_construction.save
    respond_with(@door_construction)
  end

  def update
    @door_construction.update(door_construction_params)
    respond_with(@door_construction)
  end

  def destroy
    @door_construction.destroy
    respond_with(@door_construction)
  end

  private

  def set_door_construction
    @door_construction = DoorConstruction.find(params[:id])
  end

  def door_construction_params
    params.require(:door_construction).permit(:name, :type, :certification_method, :u_factor, :open)
  end
end
