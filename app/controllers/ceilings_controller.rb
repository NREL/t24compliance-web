class CeilingsController < ApplicationController
  before_action :set_ceiling, only: [:show, :edit, :update, :destroy]

  # GET /ceilings
  # GET /ceilings.json
  def index
    @ceilings = Ceiling.all
  end

  # GET /ceilings/1
  # GET /ceilings/1.json
  def show
  end

  # GET /ceilings/new
  def new
    @ceiling = Ceiling.new
  end

  # GET /ceilings/1/edit
  def edit
  end

  # POST /ceilings
  # POST /ceilings.json
  def create
    @ceiling = Ceiling.new(ceiling_params)

    respond_to do |format|
      if @ceiling.save
        format.html { redirect_to @ceiling, notice: 'Ceiling was successfully created.' }
        format.json { render :show, status: :created, location: @ceiling }
      else
        format.html { render :new }
        format.json { render json: @ceiling.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /ceilings/1
  # PATCH/PUT /ceilings/1.json
  def update
    respond_to do |format|
      if @ceiling.update(ceiling_params)
        format.html { redirect_to @ceiling, notice: 'Ceiling was successfully updated.' }
        format.json { render :show, status: :ok, location: @ceiling }
      else
        format.html { render :edit }
        format.json { render json: @ceiling.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /ceilings/1
  # DELETE /ceilings/1.json
  def destroy
    @ceiling.destroy
    respond_to do |format|
      format.html { redirect_to ceilings_url, notice: 'Ceiling was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ceiling
      @ceiling = Ceiling.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def ceiling_params
      params.require(:ceiling).permit(:name, :area)
    end
end
