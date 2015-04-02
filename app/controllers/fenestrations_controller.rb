class FenestrationsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource :project # the resource is project
  before_action :set_fenestration, only: [:show]

  respond_to :json, :html

  def index
    @fenestrations = Fenestration.all
    respond_with(@fenestrations)
  end

  def show
    respond_with(@fenestration)
  end

  private

  def set_fenestration
    @fenestration = Fenestration.find(params[:id])
  end
end
