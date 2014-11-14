class FluidSegmentsController < ApplicationController
  before_action :set_fluid_segment, only: [:show, :edit, :update, :destroy]

  # GET /fluid_segments
  # GET /fluid_segments.json
  def index
    @fluid_segments = FluidSegment.all
  end

  # GET /fluid_segments/1
  # GET /fluid_segments/1.json
  def show
  end

  # GET /fluid_segments/new
  def new
    @fluid_segment = FluidSegment.new
  end

  # GET /fluid_segments/1/edit
  def edit
  end

  # POST /fluid_segments
  # POST /fluid_segments.json
  def create
    @fluid_segment = FluidSegment.new(fluid_segment_params)

    respond_to do |format|
      if @fluid_segment.save
        format.html { redirect_to @fluid_segment, notice: 'Fluid segment was successfully created.' }
        format.json { render :show, status: :created, location: @fluid_segment }
      else
        format.html { render :new }
        format.json { render json: @fluid_segment.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /fluid_segments/1
  # PATCH/PUT /fluid_segments/1.json
  def update
    respond_to do |format|
      if @fluid_segment.update(fluid_segment_params)
        format.html { redirect_to @fluid_segment, notice: 'Fluid segment was successfully updated.' }
        format.json { render :show, status: :ok, location: @fluid_segment }
      else
        format.html { render :edit }
        format.json { render json: @fluid_segment.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /fluid_segments/1
  # DELETE /fluid_segments/1.json
  def destroy
    @fluid_segment.destroy
    respond_to do |format|
      format.html { redirect_to fluid_segments_url, notice: 'Fluid segment was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_fluid_segment
      @fluid_segment = FluidSegment.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def fluid_segment_params
      params.require(:fluid_segment).permit(:name, :type, :source)
    end
end
