class LuminairesController < ApplicationController
  before_action :set_luminaire, only: [:show, :edit, :update, :destroy]

  # GET /luminaires
  # GET /luminaires.json
  def index
    @luminaires = Luminaire.all
  end

  # GET /luminaires/1
  # GET /luminaires/1.json
  def show
  end

  # GET /luminaires/new
  def new
    @luminaire = Luminaire.new
  end

  # GET /luminaires/1/edit
  def edit
  end

  # POST /luminaires
  # POST /luminaires.json
  def create
    @luminaire = Luminaire.new(luminaire_params)

    respond_to do |format|
      if @luminaire.save
        format.html { redirect_to @luminaire, notice: 'Luminaire was successfully created.' }
        format.json { render :show, status: :created, location: @luminaire }
      else
        format.html { render :new }
        format.json { render json: @luminaire.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /luminaires/1
  # PATCH/PUT /luminaires/1.json
  def update
    respond_to do |format|
      if @luminaire.update(luminaire_params)
        format.html { redirect_to @luminaire, notice: 'Luminaire was successfully updated.' }
        format.json { render :show, status: :ok, location: @luminaire }
      else
        format.html { render :edit }
        format.json { render json: @luminaire.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /luminaires/1
  # DELETE /luminaires/1.json
  def destroy
    @luminaire.destroy
    respond_to do |format|
      format.html { redirect_to luminaires_url, notice: 'Luminaire was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_luminaire
      @luminaire = Luminaire.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def luminaire_params
      params.require(:luminaire).permit(:name, :fixture_type, :lamp_type)
    end
end
