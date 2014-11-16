class BoilersController < ApplicationController
  before_action :set_boiler, only: [:show, :edit, :update, :destroy]

  # GET /boilers
  # GET /boilers.json
  def index
    @boilers = Boiler.all
  end

  # GET /boilers/1
  # GET /boilers/1.json
  def show
  end

  # GET /boilers/new
  def new
    @boiler = Boiler.new
  end

  # GET /boilers/1/edit
  def edit
  end

  # POST /boilers
  # POST /boilers.json
  def create
    @boiler = Boiler.new(boiler_params)

    respond_to do |format|
      if @boiler.save
        format.html { redirect_to @boiler, notice: 'Boiler was successfully created.' }
        format.json { render :show, status: :created, location: @boiler }
      else
        format.html { render :new }
        format.json { render json: @boiler.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /boilers/1
  # PATCH/PUT /boilers/1.json
  def update
    respond_to do |format|
      if @boiler.update(boiler_params)
        format.html { redirect_to @boiler, notice: 'Boiler was successfully updated.' }
        format.json { render :show, status: :ok, location: @boiler }
      else
        format.html { render :edit }
        format.json { render json: @boiler.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /boilers/1
  # DELETE /boilers/1.json
  def destroy
    @boiler.destroy
    respond_to do |format|
      format.html { redirect_to boilers_url, notice: 'Boiler was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_boiler
      @boiler = Boiler.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def boiler_params
      params.require(:boiler).permit(:name)
    end
end
