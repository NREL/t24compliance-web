class EvaporativeCoolersController < ApplicationController
  before_action :set_evaporative_cooler, only: [:show, :edit, :update, :destroy]

  # GET /evaporative_coolers
  # GET /evaporative_coolers.json
  def index
    @evaporative_coolers = EvaporativeCooler.all
  end

  # GET /evaporative_coolers/1
  # GET /evaporative_coolers/1.json
  def show
  end

  # GET /evaporative_coolers/new
  def new
    @evaporative_cooler = EvaporativeCooler.new
  end

  # GET /evaporative_coolers/1/edit
  def edit
  end

  # POST /evaporative_coolers
  # POST /evaporative_coolers.json
  def create
    @evaporative_cooler = EvaporativeCooler.new(evaporative_cooler_params)

    respond_to do |format|
      if @evaporative_cooler.save
        format.html { redirect_to @evaporative_cooler, notice: 'Evaporative cooler was successfully created.' }
        format.json { render :show, status: :created, location: @evaporative_cooler }
      else
        format.html { render :new }
        format.json { render json: @evaporative_cooler.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /evaporative_coolers/1
  # PATCH/PUT /evaporative_coolers/1.json
  def update
    respond_to do |format|
      if @evaporative_cooler.update(evaporative_cooler_params)
        format.html { redirect_to @evaporative_cooler, notice: 'Evaporative cooler was successfully updated.' }
        format.json { render :show, status: :ok, location: @evaporative_cooler }
      else
        format.html { render :edit }
        format.json { render json: @evaporative_cooler.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /evaporative_coolers/1
  # DELETE /evaporative_coolers/1.json
  def destroy
    @evaporative_cooler.destroy
    respond_to do |format|
      format.html { redirect_to evaporative_coolers_url, notice: 'Evaporative cooler was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_evaporative_cooler
      @evaporative_cooler = EvaporativeCooler.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def evaporative_cooler_params
      params.require(:evaporative_cooler).permit(:name, :type)
    end
end
