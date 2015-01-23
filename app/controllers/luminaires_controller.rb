class LuminairesController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource :project
  before_action :set_luminaire, only: [:show, :edit, :update, :destroy]
  before_action :get_project

  respond_to :json, :html

  def index
    @luminaires = (@project.present?) ? @project.luminaires : []
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

  # receives hash with form {project_id: ..., data: [array of luminaires]}
  def bulk_sync
      luminaires = []

      clean_params = luminaires_params
      logger.info("CLEAN PARAMS: #{clean_params.inspect}")

      # add / update
      if clean_params.has_key?('data')
        clean_params[:data].each do |rec|
          logger.info("RECORD of type #{rec['type']}:  #{rec.inspect}")
          if rec.has_key?('id') and !rec['id'].nil?
            @lum = Luminaire.find(rec['id'])
            @lum.update(rec)
          else
            @lum = Luminaire.new(rec)
            @lum.save
          end
          luminaires << @lum
        end

      end

      @project.luminaires = luminaires
      @project.save

    # TODO: add error handling?!
    respond_with luminaires.first || Luminaire.new
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

    def get_project
      @project = Project.where(:id => params[:project_id]).first
    end

    def luminaires_params
      params.permit(:project_id, :building_id, data: [:id, :name, :fixture_type, :lamp_type, :power, :heat_gain_space_fraction, :heat_gain_radiant_fraction])
    end
end
