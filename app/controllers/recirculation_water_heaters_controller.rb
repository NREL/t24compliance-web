class RecirculationWaterHeatersController < ApplicationController
  before_action :set_recirculation_water_heater, only: [:show, :edit, :update, :destroy]

  # GET /recirculation_water_heaters
  # GET /recirculation_water_heaters.json
  def index
    @recirculation_water_heaters = RecirculationWaterHeater.all
  end

  # GET /recirculation_water_heaters/1
  # GET /recirculation_water_heaters/1.json
  def show
  end

  # GET /recirculation_water_heaters/new
  def new
    @recirculation_water_heater = RecirculationWaterHeater.new
  end

  # GET /recirculation_water_heaters/1/edit
  def edit
  end

  # POST /recirculation_water_heaters
  # POST /recirculation_water_heaters.json
  def create
    @recirculation_water_heater = RecirculationWaterHeater.new(recirculation_water_heater_params)

    respond_to do |format|
      if @recirculation_water_heater.save
        format.html { redirect_to @recirculation_water_heater, notice: 'Recirculation water heater was successfully created.' }
        format.json { render :show, status: :created, location: @recirculation_water_heater }
      else
        format.html { render :new }
        format.json { render json: @recirculation_water_heater.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /recirculation_water_heaters/1
  # PATCH/PUT /recirculation_water_heaters/1.json
  def update
    respond_to do |format|
      if @recirculation_water_heater.update(recirculation_water_heater_params)
        format.html { redirect_to @recirculation_water_heater, notice: 'Recirculation water heater was successfully updated.' }
        format.json { render :show, status: :ok, location: @recirculation_water_heater }
      else
        format.html { render :edit }
        format.json { render json: @recirculation_water_heater.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /recirculation_water_heaters/1
  # DELETE /recirculation_water_heaters/1.json
  def destroy
    @recirculation_water_heater.destroy
    respond_to do |format|
      format.html { redirect_to recirculation_water_heaters_url, notice: 'Recirculation water heater was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_recirculation_water_heater
      @recirculation_water_heater = RecirculationWaterHeater.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def recirculation_water_heater_params
      params.require(:recirculation_water_heater).permit(:name, :status, :element_type, :tank_category)
    end
end
