class ThermalZonesController < ApplicationController
  before_action :set_thermal_zone, only: [:show, :edit, :update, :destroy]

  # GET /thermal_zones
  # GET /thermal_zones.json
  def index
    @thermal_zones = ThermalZone.all
  end

  # GET /thermal_zones/1
  # GET /thermal_zones/1.json
  def show
  end

  # GET /thermal_zones/new
  def new
    @thermal_zone = ThermalZone.new
  end

  # GET /thermal_zones/1/edit
  def edit
  end

  # POST /thermal_zones
  # POST /thermal_zones.json
  def create
    @thermal_zone = ThermalZone.new(thermal_zone_params)

    respond_to do |format|
      if @thermal_zone.save
        format.html { redirect_to @thermal_zone, notice: 'Thermal zone was successfully created.' }
        format.json { render :show, status: :created, location: @thermal_zone }
      else
        format.html { render :new }
        format.json { render json: @thermal_zone.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /thermal_zones/1
  # PATCH/PUT /thermal_zones/1.json
  def update
    respond_to do |format|
      if @thermal_zone.update(thermal_zone_params)
        format.html { redirect_to @thermal_zone, notice: 'Thermal zone was successfully updated.' }
        format.json { render :show, status: :ok, location: @thermal_zone }
      else
        format.html { render :edit }
        format.json { render json: @thermal_zone.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /thermal_zones/1
  # DELETE /thermal_zones/1.json
  def destroy
    @thermal_zone.destroy
    respond_to do |format|
      format.html { redirect_to thermal_zones_url, notice: 'Thermal zone was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_thermal_zone
      @thermal_zone = ThermalZone.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def thermal_zone_params
      params.require(:thermal_zone).permit(:name, :type, :multiplier)
    end
end
