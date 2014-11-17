class SkylightsController < ApplicationController
  before_action :set_skylight, only: [:show, :edit, :update, :destroy]

  # GET /skylights
  # GET /skylights.json
  def index
    @skylights = Skylight.all
  end

  # GET /skylights/1
  # GET /skylights/1.json
  def show
  end

  # GET /skylights/new
  def new
    @skylight = Skylight.new
  end

  # GET /skylights/1/edit
  def edit
  end

  # POST /skylights
  # POST /skylights.json
  def create
    @skylight = Skylight.new(skylight_params)

    respond_to do |format|
      if @skylight.save
        format.html { redirect_to @skylight, notice: 'Skylight was successfully created.' }
        format.json { render :show, status: :created, location: @skylight }
      else
        format.html { render :new }
        format.json { render json: @skylight.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /skylights/1
  # PATCH/PUT /skylights/1.json
  def update
    respond_to do |format|
      if @skylight.update(skylight_params)
        format.html { redirect_to @skylight, notice: 'Skylight was successfully updated.' }
        format.json { render :show, status: :ok, location: @skylight }
      else
        format.html { render :edit }
        format.json { render json: @skylight.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /skylights/1
  # DELETE /skylights/1.json
  def destroy
    @skylight.destroy
    respond_to do |format|
      format.html { redirect_to skylights_url, notice: 'Skylight was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_skylight
      @skylight = Skylight.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def skylight_params
      params.require(:skylight).permit(:name, :status, :fenestration_construction_reference, :area)
    end
end
