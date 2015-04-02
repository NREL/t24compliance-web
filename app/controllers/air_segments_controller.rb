class AirSegmentsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :air_segment_params
  before_action :set_air_segment, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @air_segments = AirSegment.all
    respond_with(@air_segments)
  end

  def show
    respond_with(@air_segment)
  end

  def new
    @air_segment = AirSegment.new
    respond_with(@air_segment)
  end

  def edit
  end

  def create
    @air_segment = AirSegment.new(air_segment_params)
    @air_segment.save
    respond_with(@air_segment)
  end

  def update
    @air_segment.update(air_segment_params)
    respond_with(@air_segment)
  end

  def destroy
    @air_segment.destroy
    respond_with(@air_segment)
  end

  private

  def set_air_segment
    @air_segment = AirSegment.find(params[:id])
  end

  def air_segment_params
    params.require(:air_segment).permit(:name, :type, :path)
  end
end
