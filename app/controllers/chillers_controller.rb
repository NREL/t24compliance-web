class ChillersController < ApplicationController
  before_action :set_chiller, only: [:show, :edit, :update, :destroy]

  # GET /chillers
  # GET /chillers.json
  def index
    @chillers = Chiller.all
  end

  # GET /chillers/1
  # GET /chillers/1.json
  def show
  end

  # GET /chillers/new
  def new
    @chiller = Chiller.new
  end

  # GET /chillers/1/edit
  def edit
  end

  # POST /chillers
  # POST /chillers.json
  def create
    @chiller = Chiller.new(chiller_params)

    respond_to do |format|
      if @chiller.save
        format.html { redirect_to @chiller, notice: 'Chiller was successfully created.' }
        format.json { render :show, status: :created, location: @chiller }
      else
        format.html { render :new }
        format.json { render json: @chiller.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /chillers/1
  # PATCH/PUT /chillers/1.json
  def update
    respond_to do |format|
      if @chiller.update(chiller_params)
        format.html { redirect_to @chiller, notice: 'Chiller was successfully updated.' }
        format.json { render :show, status: :ok, location: @chiller }
      else
        format.html { render :edit }
        format.json { render json: @chiller.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /chillers/1
  # DELETE /chillers/1.json
  def destroy
    @chiller.destroy
    respond_to do |format|
      format.html { redirect_to chillers_url, notice: 'Chiller was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_chiller
      @chiller = Chiller.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def chiller_params
      params.require(:chiller).permit(:name, :type)
    end
end
