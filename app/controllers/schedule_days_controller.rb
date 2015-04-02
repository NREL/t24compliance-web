class ScheduleDaysController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :schedule_day_params
  before_action :set_schedule_day, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @schedule_days = ScheduleDay.all
    respond_with(@schedule_days)
  end

  def show
    respond_with(@schedule_day)
  end

  def new
    @schedule_day = ScheduleDay.new
    respond_with(@schedule_day)
  end

  def edit
  end

  def create
    @schedule_day = ScheduleDay.new(schedule_day_params)
    @schedule_day.save
    respond_with(@schedule_day)
  end

  def update
    @schedule_day.update(schedule_day_params)
    respond_with(@schedule_day)
  end

  def destroy
    @schedule_day.destroy
    respond_with(@schedule_day)
  end

  private

  def set_schedule_day
    @schedule_day = ScheduleDay.find(params[:id])
  end

  def schedule_day_params
    params.require(:schedule_day).permit(:name, :type, :hour)
  end
end
