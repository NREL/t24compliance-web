class SpaceFunctionDefaultsController < ApplicationController
  before_action :set_space_function_default, only: [:show, :edit, :update, :destroy]

  # GET /space_function_defaults
  # GET /space_function_defaults.json
  def index
    @space_function_defaults = SpaceFunctionDefault.all
  end

  # GET /space_function_defaults/1
  # GET /space_function_defaults/1.json
  def show
  end

  # GET /space_function_defaults/new
  def new
    @space_function_default = SpaceFunctionDefault.new
  end

  # GET /space_function_defaults/1/edit
  def edit
  end

  # POST /space_function_defaults
  # POST /space_function_defaults.json
  def create
    @space_function_default = SpaceFunctionDefault.new(space_function_default_params)

    respond_to do |format|
      if @space_function_default.save
        format.html { redirect_to @space_function_default, notice: 'Space function default was successfully created.' }
        format.json { render :show, status: :created, location: @space_function_default }
      else
        format.html { render :new }
        format.json { render json: @space_function_default.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /space_function_defaults/1
  # PATCH/PUT /space_function_defaults/1.json
  def update
    respond_to do |format|
      if @space_function_default.update(space_function_default_params)
        format.html { redirect_to @space_function_default, notice: 'Space function default was successfully updated.' }
        format.json { render :show, status: :ok, location: @space_function_default }
      else
        format.html { render :edit }
        format.json { render json: @space_function_default.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /space_function_defaults/1
  # DELETE /space_function_defaults/1.json
  def destroy
    @space_function_default.destroy
    respond_to do |format|
      format.html { redirect_to space_function_defaults_url, notice: 'Space function default was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_space_function_default
      @space_function_default = SpaceFunctionDefault.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def space_function_default_params
      params.require(:space_function_default).permit(:name, :space_function, :function_schedule_group)
    end
end
