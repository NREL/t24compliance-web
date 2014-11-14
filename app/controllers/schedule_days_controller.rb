class ScheduleDaysController < ApplicationController
  before_action :set_schedule_day, only: [:show, :edit, :update, :destroy]

  # GET /schedule_days
  # GET /schedule_days.json
  def index
    @schedule_days = ScheduleDay.all
  end

  # GET /schedule_days/1
  # GET /schedule_days/1.json
  def show
  end

  # GET /schedule_days/new
  def new
    @schedule_day = ScheduleDay.new
  end

  # GET /schedule_days/1/edit
  def edit
  end

  # POST /schedule_days
  # POST /schedule_days.json
  def create
    @schedule_day = ScheduleDay.new(schedule_day_params)

    respond_to do |format|
      if @schedule_day.save
        format.html { redirect_to @schedule_day, notice: 'Schedule day was successfully created.' }
        format.json { render :show, status: :created, location: @schedule_day }
      else
        format.html { render :new }
        format.json { render json: @schedule_day.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /schedule_days/1
  # PATCH/PUT /schedule_days/1.json
  def update
    respond_to do |format|
      if @schedule_day.update(schedule_day_params)
        format.html { redirect_to @schedule_day, notice: 'Schedule day was successfully updated.' }
        format.json { render :show, status: :ok, location: @schedule_day }
      else
        format.html { render :edit }
        format.json { render json: @schedule_day.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /schedule_days/1
  # DELETE /schedule_days/1.json
  def destroy
    @schedule_day.destroy
    respond_to do |format|
      format.html { redirect_to schedule_days_url, notice: 'Schedule day was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_schedule_day
      @schedule_day = ScheduleDay.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def schedule_day_params
      params.require(:schedule_day).permit(:name, :type)
    end
end
