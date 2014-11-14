class ZoneSystemsController < ApplicationController
  before_action :set_zone_system, only: [:show, :edit, :update, :destroy]

  # GET /zone_systems
  # GET /zone_systems.json
  def index
    @zone_systems = ZoneSystem.all
  end

  # GET /zone_systems/1
  # GET /zone_systems/1.json
  def show
  end

  # GET /zone_systems/new
  def new
    @zone_system = ZoneSystem.new
  end

  # GET /zone_systems/1/edit
  def edit
  end

  # POST /zone_systems
  # POST /zone_systems.json
  def create
    @zone_system = ZoneSystem.new(zone_system_params)

    respond_to do |format|
      if @zone_system.save
        format.html { redirect_to @zone_system, notice: 'Zone system was successfully created.' }
        format.json { render :show, status: :created, location: @zone_system }
      else
        format.html { render :new }
        format.json { render json: @zone_system.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /zone_systems/1
  # PATCH/PUT /zone_systems/1.json
  def update
    respond_to do |format|
      if @zone_system.update(zone_system_params)
        format.html { redirect_to @zone_system, notice: 'Zone system was successfully updated.' }
        format.json { render :show, status: :ok, location: @zone_system }
      else
        format.html { render :edit }
        format.json { render json: @zone_system.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /zone_systems/1
  # DELETE /zone_systems/1.json
  def destroy
    @zone_system.destroy
    respond_to do |format|
      format.html { redirect_to zone_systems_url, notice: 'Zone system was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_zone_system
      @zone_system = ZoneSystem.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def zone_system_params
      params.require(:zone_system).permit(:name, :status, :type)
    end
end
