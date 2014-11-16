class ExternalShadingObjectsController < ApplicationController
  before_action :set_external_shading_object, only: [:show, :edit, :update, :destroy]

  # GET /external_shading_objects
  # GET /external_shading_objects.json
  def index
    @external_shading_objects = ExternalShadingObject.all
  end

  # GET /external_shading_objects/1
  # GET /external_shading_objects/1.json
  def show
  end

  # GET /external_shading_objects/new
  def new
    @external_shading_object = ExternalShadingObject.new
  end

  # GET /external_shading_objects/1/edit
  def edit
  end

  # POST /external_shading_objects
  # POST /external_shading_objects.json
  def create
    @external_shading_object = ExternalShadingObject.new(external_shading_object_params)

    respond_to do |format|
      if @external_shading_object.save
        format.html { redirect_to @external_shading_object, notice: 'External shading object was successfully created.' }
        format.json { render :show, status: :created, location: @external_shading_object }
      else
        format.html { render :new }
        format.json { render json: @external_shading_object.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /external_shading_objects/1
  # PATCH/PUT /external_shading_objects/1.json
  def update
    respond_to do |format|
      if @external_shading_object.update(external_shading_object_params)
        format.html { redirect_to @external_shading_object, notice: 'External shading object was successfully updated.' }
        format.json { render :show, status: :ok, location: @external_shading_object }
      else
        format.html { render :edit }
        format.json { render json: @external_shading_object.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /external_shading_objects/1
  # DELETE /external_shading_objects/1.json
  def destroy
    @external_shading_object.destroy
    respond_to do |format|
      format.html { redirect_to external_shading_objects_url, notice: 'External shading object was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_external_shading_object
      @external_shading_object = ExternalShadingObject.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def external_shading_object_params
      params.require(:external_shading_object).permit(:name, :status)
    end
end
