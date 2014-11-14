class UndergroundWallsController < ApplicationController
  before_action :set_underground_wall, only: [:show, :edit, :update, :destroy]

  # GET /underground_walls
  # GET /underground_walls.json
  def index
    @underground_walls = UndergroundWall.all
  end

  # GET /underground_walls/1
  # GET /underground_walls/1.json
  def show
  end

  # GET /underground_walls/new
  def new
    @underground_wall = UndergroundWall.new
  end

  # GET /underground_walls/1/edit
  def edit
  end

  # POST /underground_walls
  # POST /underground_walls.json
  def create
    @underground_wall = UndergroundWall.new(underground_wall_params)

    respond_to do |format|
      if @underground_wall.save
        format.html { redirect_to @underground_wall, notice: 'Underground wall was successfully created.' }
        format.json { render :show, status: :created, location: @underground_wall }
      else
        format.html { render :new }
        format.json { render json: @underground_wall.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /underground_walls/1
  # PATCH/PUT /underground_walls/1.json
  def update
    respond_to do |format|
      if @underground_wall.update(underground_wall_params)
        format.html { redirect_to @underground_wall, notice: 'Underground wall was successfully updated.' }
        format.json { render :show, status: :ok, location: @underground_wall }
      else
        format.html { render :edit }
        format.json { render json: @underground_wall.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /underground_walls/1
  # DELETE /underground_walls/1.json
  def destroy
    @underground_wall.destroy
    respond_to do |format|
      format.html { redirect_to underground_walls_url, notice: 'Underground wall was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_underground_wall
      @underground_wall = UndergroundWall.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def underground_wall_params
      params.require(:underground_wall).permit(:name, :status, :area)
    end
end
