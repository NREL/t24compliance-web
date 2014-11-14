class InteriorLightingSystemsController < ApplicationController
  before_action :set_interior_lighting_system, only: [:show, :edit, :update, :destroy]

  # GET /interior_lighting_systems
  # GET /interior_lighting_systems.json
  def index
    @interior_lighting_systems = InteriorLightingSystem.all
  end

  # GET /interior_lighting_systems/1
  # GET /interior_lighting_systems/1.json
  def show
  end

  # GET /interior_lighting_systems/new
  def new
    @interior_lighting_system = InteriorLightingSystem.new
  end

  # GET /interior_lighting_systems/1/edit
  def edit
  end

  # POST /interior_lighting_systems
  # POST /interior_lighting_systems.json
  def create
    @interior_lighting_system = InteriorLightingSystem.new(interior_lighting_system_params)

    respond_to do |format|
      if @interior_lighting_system.save
        format.html { redirect_to @interior_lighting_system, notice: 'Interior lighting system was successfully created.' }
        format.json { render :show, status: :created, location: @interior_lighting_system }
      else
        format.html { render :new }
        format.json { render json: @interior_lighting_system.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /interior_lighting_systems/1
  # PATCH/PUT /interior_lighting_systems/1.json
  def update
    respond_to do |format|
      if @interior_lighting_system.update(interior_lighting_system_params)
        format.html { redirect_to @interior_lighting_system, notice: 'Interior lighting system was successfully updated.' }
        format.json { render :show, status: :ok, location: @interior_lighting_system }
      else
        format.html { render :edit }
        format.json { render json: @interior_lighting_system.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /interior_lighting_systems/1
  # DELETE /interior_lighting_systems/1.json
  def destroy
    @interior_lighting_system.destroy
    respond_to do |format|
      format.html { redirect_to interior_lighting_systems_url, notice: 'Interior lighting system was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_interior_lighting_system
      @interior_lighting_system = InteriorLightingSystem.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def interior_lighting_system_params
      params.require(:interior_lighting_system).permit(:name, :status, :parent_space_function)
    end
end
