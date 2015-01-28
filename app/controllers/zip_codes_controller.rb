class ZipCodesController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource :project #the resource is project
  before_action :set_zip, only: [:show]

  respond_to :json, :html

  def index
    @zips = ZipCodes.all
    respond_with(@zips)
  end

  def show
    respond_with(@zip)
  end

  private
  def set_zip
    @zip = ZipCodes.find(params[:id])
  end

end
