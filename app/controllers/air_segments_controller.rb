class AirSegmentsController < ApplicationController
  before_action :set_air_segment, only: [:show, :edit, :update, :destroy]

  # GET /air_segments
  # GET /air_segments.json
  def index
    @air_segments = AirSegment.all
  end

  # GET /air_segments/1
  # GET /air_segments/1.json
  def show
  end

  # GET /air_segments/new
  def new
    @air_segment = AirSegment.new
  end

  # GET /air_segments/1/edit
  def edit
  end

  # POST /air_segments
  # POST /air_segments.json
  def create
    @air_segment = AirSegment.new(air_segment_params)

    respond_to do |format|
      if @air_segment.save
        format.html { redirect_to @air_segment, notice: 'Air segment was successfully created.' }
        format.json { render :show, status: :created, location: @air_segment }
      else
        format.html { render :new }
        format.json { render json: @air_segment.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /air_segments/1
  # PATCH/PUT /air_segments/1.json
  def update
    respond_to do |format|
      if @air_segment.update(air_segment_params)
        format.html { redirect_to @air_segment, notice: 'Air segment was successfully updated.' }
        format.json { render :show, status: :ok, location: @air_segment }
      else
        format.html { render :edit }
        format.json { render json: @air_segment.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /air_segments/1
  # DELETE /air_segments/1.json
  def destroy
    @air_segment.destroy
    respond_to do |format|
      format.html { redirect_to air_segments_url, notice: 'Air segment was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_air_segment
      @air_segment = AirSegment.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def air_segment_params
      params.require(:air_segment).permit(:name)
    end
end
