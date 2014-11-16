class FluidSystemsController < ApplicationController
  before_action :set_fluid_system, only: [:show, :edit, :update, :destroy]

  # GET /fluid_systems
  # GET /fluid_systems.json
  def index
    @fluid_systems = FluidSystem.all
  end

  # GET /fluid_systems/1
  # GET /fluid_systems/1.json
  def show
  end

  # GET /fluid_systems/new
  def new
    @fluid_system = FluidSystem.new
  end

  # GET /fluid_systems/1/edit
  def edit
  end

  # POST /fluid_systems
  # POST /fluid_systems.json
  def create
    @fluid_system = FluidSystem.new(fluid_system_params)

    respond_to do |format|
      if @fluid_system.save
        format.html { redirect_to @fluid_system, notice: 'Fluid system was successfully created.' }
        format.json { render :show, status: :created, location: @fluid_system }
      else
        format.html { render :new }
        format.json { render json: @fluid_system.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /fluid_systems/1
  # PATCH/PUT /fluid_systems/1.json
  def update
    respond_to do |format|
      if @fluid_system.update(fluid_system_params)
        format.html { redirect_to @fluid_system, notice: 'Fluid system was successfully updated.' }
        format.json { render :show, status: :ok, location: @fluid_system }
      else
        format.html { render :edit }
        format.json { render json: @fluid_system.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /fluid_systems/1
  # DELETE /fluid_systems/1.json
  def destroy
    @fluid_system.destroy
    respond_to do |format|
      format.html { redirect_to fluid_systems_url, notice: 'Fluid system was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_fluid_system
      @fluid_system = FluidSystem.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def fluid_system_params
      params.require(:fluid_system).permit(:name, :status, :type)
    end
end
