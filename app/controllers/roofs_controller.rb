class RoofsController < ApplicationController
  before_action :set_roof, only: [:show, :edit, :update, :destroy]

  # GET /roofs
  # GET /roofs.json
  def index
    @roofs = Roof.all
  end

  # GET /roofs/1
  # GET /roofs/1.json
  def show
  end

  # GET /roofs/new
  def new
    @roof = Roof.new
  end

  # GET /roofs/1/edit
  def edit
  end

  # POST /roofs
  # POST /roofs.json
  def create
    @roof = Roof.new(roof_params)

    respond_to do |format|
      if @roof.save
        format.html { redirect_to @roof, notice: 'Roof was successfully created.' }
        format.json { render :show, status: :created, location: @roof }
      else
        format.html { render :new }
        format.json { render json: @roof.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /roofs/1
  # PATCH/PUT /roofs/1.json
  def update
    respond_to do |format|
      if @roof.update(roof_params)
        format.html { redirect_to @roof, notice: 'Roof was successfully updated.' }
        format.json { render :show, status: :ok, location: @roof }
      else
        format.html { render :edit }
        format.json { render json: @roof.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /roofs/1
  # DELETE /roofs/1.json
  def destroy
    @roof.destroy
    respond_to do |format|
      format.html { redirect_to roofs_url, notice: 'Roof was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_roof
      @roof = Roof.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def roof_params
      params.require(:roof).permit(:name, :status, :construct_assembly_reference, :area, :azimuth)
    end
end
