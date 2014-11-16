class RecirculationDhwSystemsController < ApplicationController
  before_action :set_recirculation_dhw_system, only: [:show, :edit, :update, :destroy]

  # GET /recirculation_dhw_systems
  # GET /recirculation_dhw_systems.json
  def index
    @recirculation_dhw_systems = RecirculationDhwSystem.all
  end

  # GET /recirculation_dhw_systems/1
  # GET /recirculation_dhw_systems/1.json
  def show
  end

  # GET /recirculation_dhw_systems/new
  def new
    @recirculation_dhw_system = RecirculationDhwSystem.new
  end

  # GET /recirculation_dhw_systems/1/edit
  def edit
  end

  # POST /recirculation_dhw_systems
  # POST /recirculation_dhw_systems.json
  def create
    @recirculation_dhw_system = RecirculationDhwSystem.new(recirculation_dhw_system_params)

    respond_to do |format|
      if @recirculation_dhw_system.save
        format.html { redirect_to @recirculation_dhw_system, notice: 'Recirculation dhw system was successfully created.' }
        format.json { render :show, status: :created, location: @recirculation_dhw_system }
      else
        format.html { render :new }
        format.json { render json: @recirculation_dhw_system.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /recirculation_dhw_systems/1
  # PATCH/PUT /recirculation_dhw_systems/1.json
  def update
    respond_to do |format|
      if @recirculation_dhw_system.update(recirculation_dhw_system_params)
        format.html { redirect_to @recirculation_dhw_system, notice: 'Recirculation dhw system was successfully updated.' }
        format.json { render :show, status: :ok, location: @recirculation_dhw_system }
      else
        format.html { render :edit }
        format.json { render json: @recirculation_dhw_system.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /recirculation_dhw_systems/1
  # DELETE /recirculation_dhw_systems/1.json
  def destroy
    @recirculation_dhw_system.destroy
    respond_to do |format|
      format.html { redirect_to recirculation_dhw_systems_url, notice: 'Recirculation dhw system was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_recirculation_dhw_system
      @recirculation_dhw_system = RecirculationDhwSystem.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def recirculation_dhw_system_params
      params.require(:recirculation_dhw_system).permit(:name, :status, :type)
    end
end
