class HeatRejectionsController < ApplicationController
  before_action :set_heat_rejection, only: [:show, :edit, :update, :destroy]

  # GET /heat_rejections
  # GET /heat_rejections.json
  def index
    @heat_rejections = HeatRejection.all
  end

  # GET /heat_rejections/1
  # GET /heat_rejections/1.json
  def show
  end

  # GET /heat_rejections/new
  def new
    @heat_rejection = HeatRejection.new
  end

  # GET /heat_rejections/1/edit
  def edit
  end

  # POST /heat_rejections
  # POST /heat_rejections.json
  def create
    @heat_rejection = HeatRejection.new(heat_rejection_params)

    respond_to do |format|
      if @heat_rejection.save
        format.html { redirect_to @heat_rejection, notice: 'Heat rejection was successfully created.' }
        format.json { render :show, status: :created, location: @heat_rejection }
      else
        format.html { render :new }
        format.json { render json: @heat_rejection.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /heat_rejections/1
  # PATCH/PUT /heat_rejections/1.json
  def update
    respond_to do |format|
      if @heat_rejection.update(heat_rejection_params)
        format.html { redirect_to @heat_rejection, notice: 'Heat rejection was successfully updated.' }
        format.json { render :show, status: :ok, location: @heat_rejection }
      else
        format.html { render :edit }
        format.json { render json: @heat_rejection.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /heat_rejections/1
  # DELETE /heat_rejections/1.json
  def destroy
    @heat_rejection.destroy
    respond_to do |format|
      format.html { redirect_to heat_rejections_url, notice: 'Heat rejection was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_heat_rejection
      @heat_rejection = HeatRejection.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def heat_rejection_params
      params.require(:heat_rejection).permit(:name, :status, :type)
    end
end
