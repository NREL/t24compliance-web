class ProjectsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource
  before_action :set_project, only: [:show, :edit, :update, :destroy]

  respond_to :json, :html

  def index
    @projects = Project.all
    respond_with(@projects)
  end

  def show
    respond_with(@project)
  end

  def new
    @project = Project.new
    respond_with(@project)
  end

  def edit
  end

  def create
    @project = Project.new(project_params)
    @project.user = current_user
    @project.save
    respond_with(@project)
  end

  def update
    @project.update(project_params)
    respond_with(@project)
  end

  def destroy
    @project.destroy
    respond_to do |format|
      format.html {redirect_to user_url(current_user), notice: 'Project has been deleted.' }
      format.json {head :no_content}
    end

  end

  def wizard

  end

  private
    def set_project
      @project = Project.find(params[:id])
    end

    def project_params
      params.require(:project).permit(:name, :building_energy_model_version, :geometry_input_type, :number_time_steps_per_hour, :permit_scope, :permit_month, :permit_day, :permit_year, :climate_zone_county, :climate_zone_number, :climate_zone, :latitude, :longitude, :elevation, :street_address, :city, :state, :zip_code, :owner_name, :owner_title, :owner_organization, :owner_email, :owner_phone, :architect_name, :architect_title, :architect_organization, :architect_email, :architect_phone, :hvac_engineer_name, :hvac_engineer_title, :hvac_engineer_organization, :hvac_engineer_email, :hvac_engineer_phone, :lighting_designer_name, :lighting_designer_title, :lighting_designer_organization, :lighting_designer_email, :lighting_designer_phone, :energy_modeler_name, :energy_modeler_title, :energy_modeler_organization, :energy_modeler_email, :energy_modeler_phone, :weather_station_number, :weather_station, :design_day_weather_file, :annual_weather_file, :weather_file_download_url, :site_fuel_type, :hvac_auto_sizing, :simulate_design_days, :run_period_begin_month, :run_period_begin_day, :run_period_end_month, :run_period_end_day, :run_period_year, :exceptional_condition_complete_building, :exceptional_condition_exterior_lighting, :exceptional_condition_no_cooling_system, :exceptional_condition_rated_capacity, :exceptional_condition_water_heater, :exceptional_condition_narrative, :disable_daylighting_controls, :default_daylighting_controls, :simulation_variables_site, :simulation_variables_thermal_zone, :simulation_variables_daylighting, :simulation_variables_hvac_secondary, :simulation_variables_hvac_primary, :simulation_variables_hvac_zone, :average_dry_bulb_temperature, :monthly_average_temperature_maximum_difference, :holiday_reference, :run_title, :analysis_type, :compliance_type, :rule_report_type, :rule_report_file_append, :software_version, :compliance_report_pdf, :compliance_report_xml)
    end
end
