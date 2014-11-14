class FenestrationConstructionsController < ApplicationController
  before_action :set_fenestration_construction, only: [:show, :edit, :update, :destroy]

  # GET /fenestration_constructions
  # GET /fenestration_constructions.json
  def index
    @fenestration_constructions = FenestrationConstruction.all
  end

  # GET /fenestration_constructions/1
  # GET /fenestration_constructions/1.json
  def show
  end

  # GET /fenestration_constructions/new
  def new
    @fenestration_construction = FenestrationConstruction.new
  end

  # GET /fenestration_constructions/1/edit
  def edit
  end

  # POST /fenestration_constructions
  # POST /fenestration_constructions.json
  def create
    @fenestration_construction = FenestrationConstruction.new(fenestration_construction_params)

    respond_to do |format|
      if @fenestration_construction.save
        format.html { redirect_to @fenestration_construction, notice: 'Fenestration construction was successfully created.' }
        format.json { render :show, status: :created, location: @fenestration_construction }
      else
        format.html { render :new }
        format.json { render json: @fenestration_construction.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /fenestration_constructions/1
  # PATCH/PUT /fenestration_constructions/1.json
  def update
    respond_to do |format|
      if @fenestration_construction.update(fenestration_construction_params)
        format.html { redirect_to @fenestration_construction, notice: 'Fenestration construction was successfully updated.' }
        format.json { render :show, status: :ok, location: @fenestration_construction }
      else
        format.html { render :edit }
        format.json { render json: @fenestration_construction.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /fenestration_constructions/1
  # DELETE /fenestration_constructions/1.json
  def destroy
    @fenestration_construction.destroy
    respond_to do |format|
      format.html { redirect_to fenestration_constructions_url, notice: 'Fenestration construction was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_fenestration_construction
      @fenestration_construction = FenestrationConstruction.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def fenestration_construction_params
      params.require(:fenestration_construction).permit(:name, :fenestration_type, :assembly_context)
    end
end
