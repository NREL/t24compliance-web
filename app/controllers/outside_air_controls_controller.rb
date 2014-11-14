class OutsideAirControlsController < ApplicationController
  before_action :set_outside_air_control, only: [:show, :edit, :update, :destroy]

  # GET /outside_air_controls
  # GET /outside_air_controls.json
  def index
    @outside_air_controls = OutsideAirControl.all
  end

  # GET /outside_air_controls/1
  # GET /outside_air_controls/1.json
  def show
  end

  # GET /outside_air_controls/new
  def new
    @outside_air_control = OutsideAirControl.new
  end

  # GET /outside_air_controls/1/edit
  def edit
  end

  # POST /outside_air_controls
  # POST /outside_air_controls.json
  def create
    @outside_air_control = OutsideAirControl.new(outside_air_control_params)

    respond_to do |format|
      if @outside_air_control.save
        format.html { redirect_to @outside_air_control, notice: 'Outside air control was successfully created.' }
        format.json { render :show, status: :created, location: @outside_air_control }
      else
        format.html { render :new }
        format.json { render json: @outside_air_control.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /outside_air_controls/1
  # PATCH/PUT /outside_air_controls/1.json
  def update
    respond_to do |format|
      if @outside_air_control.update(outside_air_control_params)
        format.html { redirect_to @outside_air_control, notice: 'Outside air control was successfully updated.' }
        format.json { render :show, status: :ok, location: @outside_air_control }
      else
        format.html { render :edit }
        format.json { render json: @outside_air_control.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /outside_air_controls/1
  # DELETE /outside_air_controls/1.json
  def destroy
    @outside_air_control.destroy
    respond_to do |format|
      format.html { redirect_to outside_air_controls_url, notice: 'Outside air control was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_outside_air_control
      @outside_air_control = OutsideAirControl.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def outside_air_control_params
      params.require(:outside_air_control).permit(:name, :economizer_control_method, :economizer_integration)
    end
end
