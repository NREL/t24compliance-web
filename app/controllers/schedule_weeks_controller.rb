class ScheduleWeeksController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :schedule_week_params
  before_action :set_schedule_week, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @schedule_weeks = ScheduleWeek.all
    respond_with(@schedule_weeks)
  end

  def show
    respond_with(@schedule_week)
  end

  def new
    @schedule_week = ScheduleWeek.new
    respond_with(@schedule_week)
  end

  def edit
  end

  def create
    @schedule_week = ScheduleWeek.new(schedule_week_params)
    @schedule_week.save
    respond_with(@schedule_week)
  end

  def update
    @schedule_week.update(schedule_week_params)
    respond_with(@schedule_week)
  end

  def destroy
    @schedule_week.destroy
    respond_with(@schedule_week)
  end

  private

  def set_schedule_week
    @schedule_week = ScheduleWeek.find(params[:id])
  end

  def schedule_week_params
    params.require(:schedule_week).permit(:name, :type, :schedule_day_all_days_reference, :schedule_day_weekdays_reference, :schedule_day_weekends_reference, :schedule_day_sunday_reference, :schedule_day_monday_reference, :schedule_day_tuesday_reference, :schedule_day_wednesday_reference, :schedule_day_thursday_reference, :schedule_day_friday_reference, :schedule_day_saturday_reference, :schedule_day_holiday_reference, :schedule_day_cooling_design_day_reference, :schedule_day_heating_design_day_reference)
  end
end
