class CurveQuadraticsController < ApplicationController
  before_action :set_curve_quadratic, only: [:show, :edit, :update, :destroy]

  # GET /curve_quadratics
  # GET /curve_quadratics.json
  def index
    @curve_quadratics = CurveQuadratic.all
  end

  # GET /curve_quadratics/1
  # GET /curve_quadratics/1.json
  def show
  end

  # GET /curve_quadratics/new
  def new
    @curve_quadratic = CurveQuadratic.new
  end

  # GET /curve_quadratics/1/edit
  def edit
  end

  # POST /curve_quadratics
  # POST /curve_quadratics.json
  def create
    @curve_quadratic = CurveQuadratic.new(curve_quadratic_params)

    respond_to do |format|
      if @curve_quadratic.save
        format.html { redirect_to @curve_quadratic, notice: 'Curve quadratic was successfully created.' }
        format.json { render :show, status: :created, location: @curve_quadratic }
      else
        format.html { render :new }
        format.json { render json: @curve_quadratic.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /curve_quadratics/1
  # PATCH/PUT /curve_quadratics/1.json
  def update
    respond_to do |format|
      if @curve_quadratic.update(curve_quadratic_params)
        format.html { redirect_to @curve_quadratic, notice: 'Curve quadratic was successfully updated.' }
        format.json { render :show, status: :ok, location: @curve_quadratic }
      else
        format.html { render :edit }
        format.json { render json: @curve_quadratic.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /curve_quadratics/1
  # DELETE /curve_quadratics/1.json
  def destroy
    @curve_quadratic.destroy
    respond_to do |format|
      format.html { redirect_to curve_quadratics_url, notice: 'Curve quadratic was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_curve_quadratic
      @curve_quadratic = CurveQuadratic.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def curve_quadratic_params
      params.require(:curve_quadratic).permit(:name)
    end
end
