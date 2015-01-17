class TerminalUnitsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource :building
  before_action :set_terminal_unit, only: [:show, :edit, :update, :destroy]
  before_action :get_building, only: [:bulk_sync, :index]
  before_action :get_project

  respond_to :json, :html

  def index
    @terminal_units = []
    @systems = (@building.present?) ? @building.air_systems : []
    @systems.each do |sys|
      units = sys.terminal_units
      units.each do |unit|
        unit['fan'] = unit.fans.first || nil
        unit['coil_heating'] = unit.coil_heatings.first || nil
        @terminal_units << unit
      end
    end
    respond_with(@terminal_units)
  end

  def show
    respond_with(@terminal_unit)
  end

  def new
    @terminal_unit = TerminalUnit.new
    respond_with(@terminal_unit)
  end

  def edit
  end

  # receives hash with form {project_id: ..., data: [array of terminal_units]}
  # updates terminal_units and related components
  def bulk_sync

    clean_params = terminal_units_params
    logger.info("CLEAN PARAMS: #{clean_params.inspect}")

    terminal_units = {}
    if clean_params.has_key?('data')
      clean_params[:data].each do |rec|
        logger.info("REC: #{rec.inspect}")

        # extract fan / coil attributes in case they are there
        fan = rec.extract!('fan')['fan']
        cool = rec.extract!('coil_heating')['coil_heating']

        # add/update
        if rec.has_key?('id') and !rec['id'].nil?
          @unit = TerminalUnit.find(rec['id'])
          @unit.update(rec)
        else
          @unit = TerminalUnit.new(rec)
        end

        # based on type of terminal unit, also save a fan or coil
        if rec['type'] === 'VAVReheatBox'
          # save/update a hot water heating coil (no user-defined fields)
          if @unit.coil_heatings.empty?
            coil_heatings = []
            # save it
            # retrieve hot water plant to set references (should only be 1)
            in_ref = ''
            out_ref = ''
            @fluid_system = @project.fluid_systems.where(type: 'HotWater').first
            @fluid_system.fluid_segments.each do |seg|
              if seg.type == 'Supply'
                in_ref = seg.name
              elsif seg.type == 'Return'
                out_ref = seg.name
              end
            end
            coil = CoilHeating.new({name: "#{rec['name'] + 'ReheatCoil'}", type: 'HotWater', fluid_segment_in_reference: in_ref, fluid_segment_out_reference: out_ref })
            coil.save
            coil_heatings << coil
            @unit.coil_heatings = coil_heatings
          end

        elsif rec['type'] === 'VAVNoReheatBox'
        elsif rec['type'] === 'ParallelFanBox' or rec['type'] === 'SeriesFanBox'
          # save a fan
          fans = []
        else
          # uncontrolled or unset, save nothing else!
        end

        # retrieve supply air segment for system and match to this terminal unit
        unless @unit.zone_served_reference.nil?
          # TODO: if it's nil, we can't connect this terminal to any hvac systems...problems on the UI
          system = AirSystem.where(building_id: @building.id, name: @unit.zone_served_reference).first
          unless system.nil?
            segment = system.air_segments.where(type: 'Supply').first
            unless segment.nil?
              @unit.primary_air_segment_reference = segment.name
            end
          end
        end
        @unit.save


      end
    end



    # TODO: add error handling?!
    respond_with terminal_units.first || TerminalUnit.new
  end

  def create
    @terminal_unit = TerminalUnit.new(terminal_unit_params)
    @terminal_unit.save
    respond_with(@terminal_unit)
  end

  def update
    @terminal_unit.update(terminal_unit_params)
    respond_with(@terminal_unit)
  end

  def destroy
    @terminal_unit.destroy
    respond_with(@terminal_unit)
  end

  private
    def set_terminal_unit
      @terminal_unit = TerminalUnit.find(params[:id])
    end

    def get_building
      @building = Building.where(:id => params[:building_id]).first
    end

    def get_project
      @project = Project.where(:id => params[:project_id]).first
    end

    def terminal_units_params
      params.permit(:project_id, :building_id, data: [:id, :name, :air_system_id, :status, :type, :zone_served_reference, :count, :minimum_air_fraction_schedule_reference, :primary_air_segment_reference, :primary_air_flow_maximum, :primary_air_flow_minimum, :heating_air_flow_maximum, :reheat_control_method, :induced_air_zone_reference, :induction_ratio, :fan_power_per_flow, :parallel_box_fan_flow_fraction])
    end
end
