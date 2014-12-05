class LuminairesController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :luminaire_params
  before_action :set_luminaire, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @luminaires = Luminaire.all
    respond_with(@luminaires)
  end

  def show
    respond_with(@luminaire)
  end

  def new
    @luminaire = Luminaire.new
    respond_with(@luminaire)
  end

  def edit
  end

  def create
    @luminaire = Luminaire.new(luminaire_params)
    @luminaire.save
    respond_with(@luminaire)
  end

  def update
    @luminaire.update(luminaire_params)
    respond_with(@luminaire)
  end

  def destroy
    @luminaire.destroy
    respond_with(@luminaire)
  end

  private
    def set_luminaire
      @luminaire = Luminaire.find(params[:id])
    end

    def luminaire_params
      params.require(:luminaire).permit(:name, :fixture_type, :lamp_type, :power, :heat_gain_space_fraction, :heat_gain_radiant_fraction)
    end
end
