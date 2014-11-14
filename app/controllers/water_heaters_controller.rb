class WaterHeatersController < ApplicationController
  before_action :set_water_heater, only: [:show, :edit, :update, :destroy]

  # GET /water_heaters
  # GET /water_heaters.json
  def index
    @water_heaters = WaterHeater.all
  end

  # GET /water_heaters/1
  # GET /water_heaters/1.json
  def show
  end

  # GET /water_heaters/new
  def new
    @water_heater = WaterHeater.new
  end

  # GET /water_heaters/1/edit
  def edit
  end

  # POST /water_heaters
  # POST /water_heaters.json
  def create
    @water_heater = WaterHeater.new(water_heater_params)

    respond_to do |format|
      if @water_heater.save
        format.html { redirect_to @water_heater, notice: 'Water heater was successfully created.' }
        format.json { render :show, status: :created, location: @water_heater }
      else
        format.html { render :new }
        format.json { render json: @water_heater.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /water_heaters/1
  # PATCH/PUT /water_heaters/1.json
  def update
    respond_to do |format|
      if @water_heater.update(water_heater_params)
        format.html { redirect_to @water_heater, notice: 'Water heater was successfully updated.' }
        format.json { render :show, status: :ok, location: @water_heater }
      else
        format.html { render :edit }
        format.json { render json: @water_heater.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /water_heaters/1
  # DELETE /water_heaters/1.json
  def destroy
    @water_heater.destroy
    respond_to do |format|
      format.html { redirect_to water_heaters_url, notice: 'Water heater was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_water_heater
      @water_heater = WaterHeater.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def water_heater_params
      params.require(:water_heater).permit(:name, :status, :type)
    end
end
