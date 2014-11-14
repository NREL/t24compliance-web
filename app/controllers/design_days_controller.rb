class DesignDaysController < ApplicationController
  before_action :set_design_day, only: [:show, :edit, :update, :destroy]

  # GET /design_days
  # GET /design_days.json
  def index
    @design_days = DesignDay.all
  end

  # GET /design_days/1
  # GET /design_days/1.json
  def show
  end

  # GET /design_days/new
  def new
    @design_day = DesignDay.new
  end

  # GET /design_days/1/edit
  def edit
  end

  # POST /design_days
  # POST /design_days.json
  def create
    @design_day = DesignDay.new(design_day_params)

    respond_to do |format|
      if @design_day.save
        format.html { redirect_to @design_day, notice: 'Design day was successfully created.' }
        format.json { render :show, status: :created, location: @design_day }
      else
        format.html { render :new }
        format.json { render json: @design_day.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /design_days/1
  # PATCH/PUT /design_days/1.json
  def update
    respond_to do |format|
      if @design_day.update(design_day_params)
        format.html { redirect_to @design_day, notice: 'Design day was successfully updated.' }
        format.json { render :show, status: :ok, location: @design_day }
      else
        format.html { render :edit }
        format.json { render json: @design_day.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /design_days/1
  # DELETE /design_days/1.json
  def destroy
    @design_day.destroy
    respond_to do |format|
      format.html { redirect_to design_days_url, notice: 'Design day was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_design_day
      @design_day = DesignDay.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def design_day_params
      params.require(:design_day).permit(:name)
    end
end
