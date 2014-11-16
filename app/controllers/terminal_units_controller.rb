class TerminalUnitsController < ApplicationController
  before_action :set_terminal_unit, only: [:show, :edit, :update, :destroy]

  # GET /terminal_units
  # GET /terminal_units.json
  def index
    @terminal_units = TerminalUnit.all
  end

  # GET /terminal_units/1
  # GET /terminal_units/1.json
  def show
  end

  # GET /terminal_units/new
  def new
    @terminal_unit = TerminalUnit.new
  end

  # GET /terminal_units/1/edit
  def edit
  end

  # POST /terminal_units
  # POST /terminal_units.json
  def create
    @terminal_unit = TerminalUnit.new(terminal_unit_params)

    respond_to do |format|
      if @terminal_unit.save
        format.html { redirect_to @terminal_unit, notice: 'Terminal unit was successfully created.' }
        format.json { render :show, status: :created, location: @terminal_unit }
      else
        format.html { render :new }
        format.json { render json: @terminal_unit.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /terminal_units/1
  # PATCH/PUT /terminal_units/1.json
  def update
    respond_to do |format|
      if @terminal_unit.update(terminal_unit_params)
        format.html { redirect_to @terminal_unit, notice: 'Terminal unit was successfully updated.' }
        format.json { render :show, status: :ok, location: @terminal_unit }
      else
        format.html { render :edit }
        format.json { render json: @terminal_unit.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /terminal_units/1
  # DELETE /terminal_units/1.json
  def destroy
    @terminal_unit.destroy
    respond_to do |format|
      format.html { redirect_to terminal_units_url, notice: 'Terminal unit was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_terminal_unit
      @terminal_unit = TerminalUnit.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def terminal_unit_params
      params.require(:terminal_unit).permit(:name, :status, :type)
    end
end
