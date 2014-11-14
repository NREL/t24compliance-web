class CartesianPointsController < ApplicationController
  before_action :set_cartesian_point, only: [:show, :edit, :update, :destroy]

  # GET /cartesian_points
  # GET /cartesian_points.json
  def index
    @cartesian_points = CartesianPoint.all
  end

  # GET /cartesian_points/1
  # GET /cartesian_points/1.json
  def show
  end

  # GET /cartesian_points/new
  def new
    @cartesian_point = CartesianPoint.new
  end

  # GET /cartesian_points/1/edit
  def edit
  end

  # POST /cartesian_points
  # POST /cartesian_points.json
  def create
    @cartesian_point = CartesianPoint.new(cartesian_point_params)

    respond_to do |format|
      if @cartesian_point.save
        format.html { redirect_to @cartesian_point, notice: 'Cartesian point was successfully created.' }
        format.json { render :show, status: :created, location: @cartesian_point }
      else
        format.html { render :new }
        format.json { render json: @cartesian_point.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /cartesian_points/1
  # PATCH/PUT /cartesian_points/1.json
  def update
    respond_to do |format|
      if @cartesian_point.update(cartesian_point_params)
        format.html { redirect_to @cartesian_point, notice: 'Cartesian point was successfully updated.' }
        format.json { render :show, status: :ok, location: @cartesian_point }
      else
        format.html { render :edit }
        format.json { render json: @cartesian_point.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /cartesian_points/1
  # DELETE /cartesian_points/1.json
  def destroy
    @cartesian_point.destroy
    respond_to do |format|
      format.html { redirect_to cartesian_points_url, notice: 'Cartesian point was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_cartesian_point
      @cartesian_point = CartesianPoint.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def cartesian_point_params
      params.require(:cartesian_point).permit(:name)
    end
end
