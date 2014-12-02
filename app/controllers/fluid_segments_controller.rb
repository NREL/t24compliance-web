class FluidSegmentsController < ApplicationController
  before_action :set_fluid_segment, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @fluid_segments = FluidSegment.all
    respond_with(@fluid_segments)
  end

  def show
    respond_with(@fluid_segment)
  end

  def new
    @fluid_segment = FluidSegment.new
    respond_with(@fluid_segment)
  end

  def edit
  end

  def create
    @fluid_segment = FluidSegment.new(fluid_segment_params)
    @fluid_segment.save
    respond_with(@fluid_segment)
  end

  def update
    @fluid_segment.update(fluid_segment_params)
    respond_with(@fluid_segment)
  end

  def destroy
    @fluid_segment.destroy
    respond_with(@fluid_segment)
  end

  private
    def set_fluid_segment
      @fluid_segment = FluidSegment.find(params[:id])
    end

    def fluid_segment_params
      params.require(:fluid_segment).permit(:name, :type, :source, :primary_segment_reference)
    end
end
