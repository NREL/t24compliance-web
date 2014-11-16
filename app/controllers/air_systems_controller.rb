class AirSystemsController < ApplicationController
  before_action :set_air_system, only: [:show, :edit, :update, :destroy]

  # GET /air_systems
  # GET /air_systems.json
  def index
    @air_systems = AirSystem.all
  end

  # GET /air_systems/1
  # GET /air_systems/1.json
  def show
  end

  # GET /air_systems/new
  def new
    @air_system = AirSystem.new
  end

  # GET /air_systems/1/edit
  def edit
  end

  # POST /air_systems
  # POST /air_systems.json
  def create
    @air_system = AirSystem.new(air_system_params)

    respond_to do |format|
      if @air_system.save
        format.html { redirect_to @air_system, notice: 'Air system was successfully created.' }
        format.json { render :show, status: :created, location: @air_system }
      else
        format.html { render :new }
        format.json { render json: @air_system.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /air_systems/1
  # PATCH/PUT /air_systems/1.json
  def update
    respond_to do |format|
      if @air_system.update(air_system_params)
        format.html { redirect_to @air_system, notice: 'Air system was successfully updated.' }
        format.json { render :show, status: :ok, location: @air_system }
      else
        format.html { render :edit }
        format.json { render json: @air_system.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /air_systems/1
  # DELETE /air_systems/1.json
  def destroy
    @air_system.destroy
    respond_to do |format|
      format.html { redirect_to air_systems_url, notice: 'Air system was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_air_system
      @air_system = AirSystem.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def air_system_params
      params.require(:air_system).permit(:name)
    end
end
