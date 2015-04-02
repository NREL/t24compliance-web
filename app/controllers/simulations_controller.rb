class SimulationsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource :project # the resource is project
  before_action :set_simulation, only: [:show, :edit, :update, :destroy]
  before_action :set_project, only: [:bulk_sync]

  respond_to :json, :html

  # GET /simulations
  # GET /simulations.json
  def index
    @simulations = Simulation.all
  end

  # GET /simulations/1
  # GET /simulations/1.json
  def show
    respond_with @simulation
  end

  # GET /simulations/new
  def new
    @simulation = Simulation.new
  end

  # GET /simulations/1/edit
  def edit
  end

  # POST /simulations
  # POST /simulations.json
  def create
    @simulation = Simulation.new(simulation_params)

    respond_to do |format|
      if @simulation.save
        format.html { redirect_to @simulation, notice: 'Simulation was successfully created.' }
        format.json { render :show, status: :created, location: @simulation }
      else
        format.html { render :new }
        format.json { render json: @simulation.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /simulations/1
  # PATCH/PUT /simulations/1.json
  def update
    respond_to do |format|
      if @simulation.update(simulation_params)
        format.html { redirect_to @simulation, notice: 'Simulation was successfully updated.' }
        format.json { render :show, status: :ok, location: @simulation }
      else
        format.html { render :edit }
        format.json { render json: @simulation.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /simulations/1
  # DELETE /simulations/1.json
  def destroy
    @simulation.destroy
    respond_to do |format|
      format.html { redirect_to simulations_url, notice: 'Simulation was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def bulk_sync
    clean_params = simulation_params
    logger.info "CLEAN PARAMS: #{clean_params.inspect}"

    if @project
      @project.simulation.run

      logger.info "Simulation ID is #{@project.simulation.id}"

      respond_with @project.simulation
    else
      fail 'Could not find project to run'
    end

    case clean_params[:data][:action]
      when 'xml'
        # a = Tempfile.new(['sdd', '.xml'])
        # @xml_file_path = a.path
        #
        # @simulation.project.xml_save(a.path)
        #
        # respond_with(@simulation)
      when 'run'

      when 'check'

      else
        logger.warn "unknown action '#{clean_params[:data][:action]} on SimulationController.bulk_sync'"
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_simulation
    @simulation = Simulation.find(params[:id])
  end

  def set_project
    @project = Project.find(params[:project_id])
    logger.info "Set project to #{@project}"
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def simulation_params
    logger.info 'validating parameters'
    # params.require(:simulation).permit(:filename)
    params.permit(:building_id, :project_id, :id, data: [:action])
  end
end
