class UndergroundFloorsController < ApplicationController
  before_action :set_underground_floor, only: [:show, :edit, :update, :destroy]

  # GET /underground_floors
  # GET /underground_floors.json
  def index
    @underground_floors = UndergroundFloor.all
  end

  # GET /underground_floors/1
  # GET /underground_floors/1.json
  def show
  end

  # GET /underground_floors/new
  def new
    @underground_floor = UndergroundFloor.new
  end

  # GET /underground_floors/1/edit
  def edit
  end

  # POST /underground_floors
  # POST /underground_floors.json
  def create
    @underground_floor = UndergroundFloor.new(underground_floor_params)

    respond_to do |format|
      if @underground_floor.save
        format.html { redirect_to @underground_floor, notice: 'Underground floor was successfully created.' }
        format.json { render :show, status: :created, location: @underground_floor }
      else
        format.html { render :new }
        format.json { render json: @underground_floor.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /underground_floors/1
  # PATCH/PUT /underground_floors/1.json
  def update
    respond_to do |format|
      if @underground_floor.update(underground_floor_params)
        format.html { redirect_to @underground_floor, notice: 'Underground floor was successfully updated.' }
        format.json { render :show, status: :ok, location: @underground_floor }
      else
        format.html { render :edit }
        format.json { render json: @underground_floor.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /underground_floors/1
  # DELETE /underground_floors/1.json
  def destroy
    @underground_floor.destroy
    respond_to do |format|
      format.html { redirect_to underground_floors_url, notice: 'Underground floor was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_underground_floor
      @underground_floor = UndergroundFloor.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def underground_floor_params
      params.require(:underground_floor).permit(:name, :status, :area)
    end
end
