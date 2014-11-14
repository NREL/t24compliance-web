class ConstructAssembliesController < ApplicationController
  before_action :set_construct_assembly, only: [:show, :edit, :update, :destroy]

  # GET /construct_assemblies
  # GET /construct_assemblies.json
  def index
    @construct_assemblies = ConstructAssembly.all
  end

  # GET /construct_assemblies/1
  # GET /construct_assemblies/1.json
  def show
  end

  # GET /construct_assemblies/new
  def new
    @construct_assembly = ConstructAssembly.new
  end

  # GET /construct_assemblies/1/edit
  def edit
  end

  # POST /construct_assemblies
  # POST /construct_assemblies.json
  def create
    @construct_assembly = ConstructAssembly.new(construct_assembly_params)

    respond_to do |format|
      if @construct_assembly.save
        format.html { redirect_to @construct_assembly, notice: 'Construct assembly was successfully created.' }
        format.json { render :show, status: :created, location: @construct_assembly }
      else
        format.html { render :new }
        format.json { render json: @construct_assembly.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /construct_assemblies/1
  # PATCH/PUT /construct_assemblies/1.json
  def update
    respond_to do |format|
      if @construct_assembly.update(construct_assembly_params)
        format.html { redirect_to @construct_assembly, notice: 'Construct assembly was successfully updated.' }
        format.json { render :show, status: :ok, location: @construct_assembly }
      else
        format.html { render :edit }
        format.json { render json: @construct_assembly.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /construct_assemblies/1
  # DELETE /construct_assemblies/1.json
  def destroy
    @construct_assembly.destroy
    respond_to do |format|
      format.html { redirect_to construct_assemblies_url, notice: 'Construct assembly was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_construct_assembly
      @construct_assembly = ConstructAssembly.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def construct_assembly_params
      params.require(:construct_assembly).permit(:name, :compatible_surface_type, :material_reference)
    end
end
