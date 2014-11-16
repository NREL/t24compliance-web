class CurveLinearsController < ApplicationController
  before_action :set_curve_linear, only: [:show, :edit, :update, :destroy]

  # GET /curve_linears
  # GET /curve_linears.json
  def index
    @curve_linears = CurveLinear.all
  end

  # GET /curve_linears/1
  # GET /curve_linears/1.json
  def show
  end

  # GET /curve_linears/new
  def new
    @curve_linear = CurveLinear.new
  end

  # GET /curve_linears/1/edit
  def edit
  end

  # POST /curve_linears
  # POST /curve_linears.json
  def create
    @curve_linear = CurveLinear.new(curve_linear_params)

    respond_to do |format|
      if @curve_linear.save
        format.html { redirect_to @curve_linear, notice: 'Curve linear was successfully created.' }
        format.json { render :show, status: :created, location: @curve_linear }
      else
        format.html { render :new }
        format.json { render json: @curve_linear.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /curve_linears/1
  # PATCH/PUT /curve_linears/1.json
  def update
    respond_to do |format|
      if @curve_linear.update(curve_linear_params)
        format.html { redirect_to @curve_linear, notice: 'Curve linear was successfully updated.' }
        format.json { render :show, status: :ok, location: @curve_linear }
      else
        format.html { render :edit }
        format.json { render json: @curve_linear.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /curve_linears/1
  # DELETE /curve_linears/1.json
  def destroy
    @curve_linear.destroy
    respond_to do |format|
      format.html { redirect_to curve_linears_url, notice: 'Curve linear was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_curve_linear
      @curve_linear = CurveLinear.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def curve_linear_params
      params.require(:curve_linear).permit(:name)
    end
end
