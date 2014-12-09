class ConstructionsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource
  before_action :set_construction, only: [:show]

  respond_to :json, :html

  def index
    @constructions = Construction.all
    respond_with(@constructions)
  end

  def show
    respond_with(@constructions)
  end

  private
  def set_construction
    @construction = Construction.find(params[:id])
  end

end
