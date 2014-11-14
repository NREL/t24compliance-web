class CoilHeatingsController < ApplicationController
  before_action :set_coil_heating, only: [:show, :edit, :update, :destroy]

  # GET /coil_heatings
  # GET /coil_heatings.json
  def index
    @coil_heatings = CoilHeating.all
  end

  # GET /coil_heatings/1
  # GET /coil_heatings/1.json
  def show
  end

  # GET /coil_heatings/new
  def new
    @coil_heating = CoilHeating.new
  end

  # GET /coil_heatings/1/edit
  def edit
  end

  # POST /coil_heatings
  # POST /coil_heatings.json
  def create
    @coil_heating = CoilHeating.new(coil_heating_params)

    respond_to do |format|
      if @coil_heating.save
        format.html { redirect_to @coil_heating, notice: 'Coil heating was successfully created.' }
        format.json { render :show, status: :created, location: @coil_heating }
      else
        format.html { render :new }
        format.json { render json: @coil_heating.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /coil_heatings/1
  # PATCH/PUT /coil_heatings/1.json
  def update
    respond_to do |format|
      if @coil_heating.update(coil_heating_params)
        format.html { redirect_to @coil_heating, notice: 'Coil heating was successfully updated.' }
        format.json { render :show, status: :ok, location: @coil_heating }
      else
        format.html { render :edit }
        format.json { render json: @coil_heating.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /coil_heatings/1
  # DELETE /coil_heatings/1.json
  def destroy
    @coil_heating.destroy
    respond_to do |format|
      format.html { redirect_to coil_heatings_url, notice: 'Coil heating was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_coil_heating
      @coil_heating = CoilHeating.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def coil_heating_params
      params.require(:coil_heating).permit(:name, :type)
    end
end
