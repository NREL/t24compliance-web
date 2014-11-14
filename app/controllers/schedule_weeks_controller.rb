class ScheduleWeeksController < ApplicationController
  before_action :set_schedule_week, only: [:show, :edit, :update, :destroy]

  # GET /schedule_weeks
  # GET /schedule_weeks.json
  def index
    @schedule_weeks = ScheduleWeek.all
  end

  # GET /schedule_weeks/1
  # GET /schedule_weeks/1.json
  def show
  end

  # GET /schedule_weeks/new
  def new
    @schedule_week = ScheduleWeek.new
  end

  # GET /schedule_weeks/1/edit
  def edit
  end

  # POST /schedule_weeks
  # POST /schedule_weeks.json
  def create
    @schedule_week = ScheduleWeek.new(schedule_week_params)

    respond_to do |format|
      if @schedule_week.save
        format.html { redirect_to @schedule_week, notice: 'Schedule week was successfully created.' }
        format.json { render :show, status: :created, location: @schedule_week }
      else
        format.html { render :new }
        format.json { render json: @schedule_week.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /schedule_weeks/1
  # PATCH/PUT /schedule_weeks/1.json
  def update
    respond_to do |format|
      if @schedule_week.update(schedule_week_params)
        format.html { redirect_to @schedule_week, notice: 'Schedule week was successfully updated.' }
        format.json { render :show, status: :ok, location: @schedule_week }
      else
        format.html { render :edit }
        format.json { render json: @schedule_week.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /schedule_weeks/1
  # DELETE /schedule_weeks/1.json
  def destroy
    @schedule_week.destroy
    respond_to do |format|
      format.html { redirect_to schedule_weeks_url, notice: 'Schedule week was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_schedule_week
      @schedule_week = ScheduleWeek.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def schedule_week_params
      params.require(:schedule_week).permit(:name, :type)
    end
end
