class CurveCubicsController < ApplicationController
  before_action :set_curve_cubic, only: [:show, :edit, :update, :destroy]

  # GET /curve_cubics
  # GET /curve_cubics.json
  def index
    @curve_cubics = CurveCubic.all
  end

  # GET /curve_cubics/1
  # GET /curve_cubics/1.json
  def show
  end

  # GET /curve_cubics/new
  def new
    @curve_cubic = CurveCubic.new
  end

  # GET /curve_cubics/1/edit
  def edit
  end

  # POST /curve_cubics
  # POST /curve_cubics.json
  def create
    @curve_cubic = CurveCubic.new(curve_cubic_params)

    respond_to do |format|
      if @curve_cubic.save
        format.html { redirect_to @curve_cubic, notice: 'Curve cubic was successfully created.' }
        format.json { render :show, status: :created, location: @curve_cubic }
      else
        format.html { render :new }
        format.json { render json: @curve_cubic.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /curve_cubics/1
  # PATCH/PUT /curve_cubics/1.json
  def update
    respond_to do |format|
      if @curve_cubic.update(curve_cubic_params)
        format.html { redirect_to @curve_cubic, notice: 'Curve cubic was successfully updated.' }
        format.json { render :show, status: :ok, location: @curve_cubic }
      else
        format.html { render :edit }
        format.json { render json: @curve_cubic.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /curve_cubics/1
  # DELETE /curve_cubics/1.json
  def destroy
    @curve_cubic.destroy
    respond_to do |format|
      format.html { redirect_to curve_cubics_url, notice: 'Curve cubic was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_curve_cubic
      @curve_cubic = CurveCubic.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def curve_cubic_params
      params.require(:curve_cubic).permit(:name)
    end
end
