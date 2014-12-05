class ExternalShadingObjectsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :external_shading_object_params
  before_action :set_external_shading_object, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @external_shading_objects = ExternalShadingObject.all
    respond_with(@external_shading_objects)
  end

  def show
    respond_with(@external_shading_object)
  end

  def new
    @external_shading_object = ExternalShadingObject.new
    respond_with(@external_shading_object)
  end

  def edit
  end

  def create
    @external_shading_object = ExternalShadingObject.new(external_shading_object_params)
    @external_shading_object.save
    respond_with(@external_shading_object)
  end

  def update
    @external_shading_object.update(external_shading_object_params)
    respond_with(@external_shading_object)
  end

  def destroy
    @external_shading_object.destroy
    respond_with(@external_shading_object)
  end

  private
    def set_external_shading_object
      @external_shading_object = ExternalShadingObject.find(params[:id])
    end

    def external_shading_object_params
      params.require(:external_shading_object).permit(:name, :status, :transmittance_schedule_reference, :solar_reflectance, :visible_reflectance)
    end
end
