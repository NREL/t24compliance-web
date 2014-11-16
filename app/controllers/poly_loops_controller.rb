class PolyLoopsController < ApplicationController
  before_action :set_poly_loop, only: [:show, :edit, :update, :destroy]

  # GET /poly_loops
  # GET /poly_loops.json
  def index
    @poly_loops = PolyLoop.all
  end

  # GET /poly_loops/1
  # GET /poly_loops/1.json
  def show
  end

  # GET /poly_loops/new
  def new
    @poly_loop = PolyLoop.new
  end

  # GET /poly_loops/1/edit
  def edit
  end

  # POST /poly_loops
  # POST /poly_loops.json
  def create
    @poly_loop = PolyLoop.new(poly_loop_params)

    respond_to do |format|
      if @poly_loop.save
        format.html { redirect_to @poly_loop, notice: 'Poly loop was successfully created.' }
        format.json { render :show, status: :created, location: @poly_loop }
      else
        format.html { render :new }
        format.json { render json: @poly_loop.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /poly_loops/1
  # PATCH/PUT /poly_loops/1.json
  def update
    respond_to do |format|
      if @poly_loop.update(poly_loop_params)
        format.html { redirect_to @poly_loop, notice: 'Poly loop was successfully updated.' }
        format.json { render :show, status: :ok, location: @poly_loop }
      else
        format.html { render :edit }
        format.json { render json: @poly_loop.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /poly_loops/1
  # DELETE /poly_loops/1.json
  def destroy
    @poly_loop.destroy
    respond_to do |format|
      format.html { redirect_to poly_loops_url, notice: 'Poly loop was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_poly_loop
      @poly_loop = PolyLoop.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def poly_loop_params
      params.require(:poly_loop).permit(:name)
    end
end
