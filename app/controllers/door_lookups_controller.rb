class DoorLookupsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource :project # the resource is project
  before_action :set_door, only: [:show]

  respond_to :json, :html

  def index
    @doors = DoorLookup.all
    respond_with(@doors)
  end

  def show
    respond_with(@door)
  end

  private

  def set_door
    @door = DoorLookup.find(params[:id])
  end
end
