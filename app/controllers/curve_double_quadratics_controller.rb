class CurveDoubleQuadraticsController < ApplicationController
  before_action :set_curve_double_quadratic, only: [:show, :edit, :update, :destroy]

  # GET /curve_double_quadratics
  # GET /curve_double_quadratics.json
  def index
    @curve_double_quadratics = CurveDoubleQuadratic.all
  end

  # GET /curve_double_quadratics/1
  # GET /curve_double_quadratics/1.json
  def show
  end

  # GET /curve_double_quadratics/new
  def new
    @curve_double_quadratic = CurveDoubleQuadratic.new
  end

  # GET /curve_double_quadratics/1/edit
  def edit
  end

  # POST /curve_double_quadratics
  # POST /curve_double_quadratics.json
  def create
    @curve_double_quadratic = CurveDoubleQuadratic.new(curve_double_quadratic_params)

    respond_to do |format|
      if @curve_double_quadratic.save
        format.html { redirect_to @curve_double_quadratic, notice: 'Curve double quadratic was successfully created.' }
        format.json { render :show, status: :created, location: @curve_double_quadratic }
      else
        format.html { render :new }
        format.json { render json: @curve_double_quadratic.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /curve_double_quadratics/1
  # PATCH/PUT /curve_double_quadratics/1.json
  def update
    respond_to do |format|
      if @curve_double_quadratic.update(curve_double_quadratic_params)
        format.html { redirect_to @curve_double_quadratic, notice: 'Curve double quadratic was successfully updated.' }
        format.json { render :show, status: :ok, location: @curve_double_quadratic }
      else
        format.html { render :edit }
        format.json { render json: @curve_double_quadratic.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /curve_double_quadratics/1
  # DELETE /curve_double_quadratics/1.json
  def destroy
    @curve_double_quadratic.destroy
    respond_to do |format|
      format.html { redirect_to curve_double_quadratics_url, notice: 'Curve double quadratic was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_curve_double_quadratic
      @curve_double_quadratic = CurveDoubleQuadratic.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def curve_double_quadratic_params
      params.require(:curve_double_quadratic).permit(:name)
    end
end
