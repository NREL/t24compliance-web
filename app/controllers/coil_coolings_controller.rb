class CoilCoolingsController < ApplicationController
  before_action :set_coil_cooling, only: [:show, :edit, :update, :destroy]

  # GET /coil_coolings
  # GET /coil_coolings.json
  def index
    @coil_coolings = CoilCooling.all
  end

  # GET /coil_coolings/1
  # GET /coil_coolings/1.json
  def show
  end

  # GET /coil_coolings/new
  def new
    @coil_cooling = CoilCooling.new
  end

  # GET /coil_coolings/1/edit
  def edit
  end

  # POST /coil_coolings
  # POST /coil_coolings.json
  def create
    @coil_cooling = CoilCooling.new(coil_cooling_params)

    respond_to do |format|
      if @coil_cooling.save
        format.html { redirect_to @coil_cooling, notice: 'Coil cooling was successfully created.' }
        format.json { render :show, status: :created, location: @coil_cooling }
      else
        format.html { render :new }
        format.json { render json: @coil_cooling.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /coil_coolings/1
  # PATCH/PUT /coil_coolings/1.json
  def update
    respond_to do |format|
      if @coil_cooling.update(coil_cooling_params)
        format.html { redirect_to @coil_cooling, notice: 'Coil cooling was successfully updated.' }
        format.json { render :show, status: :ok, location: @coil_cooling }
      else
        format.html { render :edit }
        format.json { render json: @coil_cooling.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /coil_coolings/1
  # DELETE /coil_coolings/1.json
  def destroy
    @coil_cooling.destroy
    respond_to do |format|
      format.html { redirect_to coil_coolings_url, notice: 'Coil cooling was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_coil_cooling
      @coil_cooling = CoilCooling.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def coil_cooling_params
      params.require(:coil_cooling).permit(:name, :type)
    end
end
