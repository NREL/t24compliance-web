class WindowsController < ApplicationController
  before_action :set_window, only: [:show, :edit, :update, :destroy]

  # GET /windows
  # GET /windows.json
  def index
    @windows = Window.all
  end

  # GET /windows/1
  # GET /windows/1.json
  def show
  end

  # GET /windows/new
  def new
    @window = Window.new
  end

  # GET /windows/1/edit
  def edit
  end

  # POST /windows
  # POST /windows.json
  def create
    @window = Window.new(window_params)

    respond_to do |format|
      if @window.save
        format.html { redirect_to @window, notice: 'Window was successfully created.' }
        format.json { render :show, status: :created, location: @window }
      else
        format.html { render :new }
        format.json { render json: @window.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /windows/1
  # PATCH/PUT /windows/1.json
  def update
    respond_to do |format|
      if @window.update(window_params)
        format.html { redirect_to @window, notice: 'Window was successfully updated.' }
        format.json { render :show, status: :ok, location: @window }
      else
        format.html { render :edit }
        format.json { render json: @window.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /windows/1
  # DELETE /windows/1.json
  def destroy
    @window.destroy
    respond_to do |format|
      format.html { redirect_to windows_url, notice: 'Window was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_window
      @window = Window.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def window_params
      params.require(:window).permit(:name, :status, :fenestration_construction_reference, :area)
    end
end
