class SpacesController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource :building
  before_action :set_space, only: [:show, :edit, :update, :destroy]
  before_action :set_building, only: [:index, :bulk_sync]
  respond_to :html, :json

  def index
    # always scope by building
    @spaces = (@building.nil?) ? [] : @building.building_stories.inject([]) { |spaces, story| spaces + story.spaces }
    respond_with(@spaces)
  end

  def show
    respond_with(@space)
  end

  def new
    @space = Space.new
    respond_with(@space)
  end

  def edit
  end

  def create
    @space = Space.new(space_params)
    @space.save
    respond_with(@space)
  end

  # receives hash with form {project_id: ..., data: [array of spaces]}
  # updates spaces and related components
  def bulk_sync

    clean_params = spaces_params
    logger.info("CLEAN PARAMS: #{clean_params.inspect}")
    spaces_by_story = {}

    # add / update
    if clean_params.has_key?('data')
      # process spaces grouped by story
      spaces_by_story = clean_params['data'].group_by{|d| d['building_story_id']}
      logger.info("SPACES BY STORY: #{spaces_by_story}")
      spaces_by_story.each do |story, spaces|
        logger.info("PROCESSING STORY: #{story}")
        story_spaces = []
        spaces.each do |space|
          logger.info("Processing space: #{space.inspect}")

          # extract surfaces
          surfaces = space.extract!('surfaces')['surfaces'] || []

          surfs = {interior_walls: [], exterior_walls: [], underground_walls: [], roofs: [], interior_floors: [], exterior_floors: [], underground_floors: []}
          logger.info("#{surfaces.size} surfaces")
          surfaces.each do |surface|
            logger.info("Processing surface: #{surface.inspect}")
            subs = {doors: [], windows: [], skylights: []}
            sub_surfaces = surface.extract!('subsurfaces')['subsurfaces'] || []
            logger.info("subsurfaces for #{surface['name']} are: #{sub_surfaces.inspect}")

            sub_surfaces.each do |sub|

              sub_klass = Object::const_get(sub['type'])
              sub_type = sub['type']

              # TODO: handle construction
              # TODO: remove for now
              sub.extract!('construction')

              # remove invalid attributes
              sub.extract!('type')
              # delete nil keys in case they are invalid for this subsurface type
              sub.delete_if {|k, v| v.nil?}
              logger.info("CLEAN subsurface: #{sub.inspect}")

              if sub.has_key?('id') and !sub['id'].nil?
                # update
                @sub = sub_klass.find(sub['id'])
                @sub.update(sub)
              else
                # create
                @sub = sub_klass.new(sub)
                @sub.save
              end
              # add to subsurfaces for this surface
              subs[sub_type.gsub(' ','_').downcase.pluralize.to_sym] << @sub
            end

            surface_type = surface['surface_type']

            # TODO: handle adjacent space references
            # TODO: for now, removing them
            # TODO: also handle construction
            surface.extract!('adjacent_space')

            # removing invalid attributes
            surface.extract!('surface_type')
            surface.extract!('boundary')
            surface.extract!('type')
            # delete all nil values to remove values that are invalid for certain surfaces
            surface.delete_if {|k, v| v.nil? }
            logger.info("CLEAN surface: #{surface.inspect}")


            klass = Object::const_get(surface_type.gsub(' ', ''))
            if surface.has_key?('id') and !surface['id'].nil?
              # update
              @surf = klass.find(surface['id'])
              @surf.update(surface)
            else
              # create
              @surf = klass.new(surface)
            end

            # assign related sub_surfaces (deletes old ones) and save
            # can't get loop to work, so explicitly setting them
            # TODO: might be good to check if subsurfaces are even valid on the give surface
            unless subs[:windows].empty?
              @surf.windows = subs[:windows]
            end
            unless subs[:skylights].empty?
              @surf.skylights = subs[:skylights]
            end
            unless subs[:doors].empty?
              @surf.doors = subs[:doors]
            end

            #subs.each do |sub_name, sub_array|
            #  @surf[sub_name.to_sym] = sub_array unless sub_array.empty?
            #end

            @surf.save
            # add to surfaces for this space
            surfs[surface_type.gsub(' ', '_').downcase.pluralize.to_sym] << @surf
          end

          # save the space with related surfaces
          if space.has_key?('id') and !space['id'].nil?
            # update
            @space = Space.find(space['id'])
            @space.update(space)
          else
            # create
            @space = Space.new(space)

          end

          # can't get loop to work, so explicitly setting them
          #surfs.each do |surf_name, surf_array|
          #  @space[surf_name.to_sym] = surf_array
          #end
          @space.interior_walls = surfs[:interior_walls]
          @space.exterior_walls = surfs[:exterior_walls]
          @space.underground_walls = surfs[:underground_walls]
          @space.roofs = surfs[:roofs]
          @space.interior_floors = surfs[:interior_floors]
          @space.exterior_floors = surfs[:exterior_floors]
          @space.underground_floors = surfs[:underground_floors]
          @space.save
          story_spaces << @space
        end

        # save the spaces to the story
        # TODO: add better handling for removing spaces (all spaces)
        @story = BuildingStory.find(story)
        @story.spaces = story_spaces
        @story.save

      end

    end

    # iterate through stories to catch special case where all spaces should be deleted
    @building.building_stories.each do |story|
      # look for key matching building_story_id
      if !spaces_by_story.has_key?("#{story.id}") or !clean_params.has_key?('data')
        story.spaces = []
        story.save
      end
    end

    # TODO: add error handling?!
    respond_with Space.new

  end

  def update
    @space.update(space_params)
    respond_with(@space)
  end

  def destroy
    @space.destroy
    respond_with(@space)
  end

  private

    def set_building
      @building = (params[:building_id].present?) ? Building.find(params[:building_id]) : nil
    end

    def set_space
      @space = Space.find(params[:id])
    end

    def spaces_params
      params.permit(:project_id, :building_id, data: [:id, :building_story_id, :name, :status, :conditioning_type, :supply_plenum_space_reference, :return_plenum_space_reference, :thermal_zone_reference, :area, :floor_area, :floor_z, :floor_to_ceiling_height, :volume, :space_function_defaults_reference, :space_function, :function_schedule_group, :occupant_density, :occupant_sensible_heat_rate, :occupant_latent_heat_rate, :occupant_schedule_reference, :infiltration_method, :design_infiltration_rate, :infiltration_schedule_reference, :infiltration_model_coefficient_a, :infiltration_model_coefficient_b, :infiltration_model_coefficient_c, :infiltration_model_coefficient_d, :envelope_status, :lighting_status, :interior_lighting_specification_method, :interior_lighting_power_density_regulated, :interior_lighting_regulated_schedule_reference, :interior_lighting_regulated_heat_gain_space_fraction, :interior_lighting_regulated_heat_gain_radiant_fraction, :interior_lighting_power_density_non_regulated, :interior_lighting_non_regulated_schedule_reference, :interior_lighting_non_regulated_heat_gain_space_fraction, :interior_lighting_non_regulated_heat_gain_radiant_fraction, :skylit_daylighting_installed_lighting_power, :primary_side_daylighting_installed_lighting_power, :secondary_side_daylighting_installed_lighting_power, :skylit100_percent_controlled, :primary_sidelit100_percent_controlled, :secondary_sidelit100_percent_controlled, :skylit_daylighting_reference_point_coordinate, :skylit_daylighting_controlled_lighting_power, :skylit_daylighting_control_lighting_fraction, :skylit_daylighting_illuminance_set_point, :primary_side_daylighting_reference_point_coordinate, :primary_side_daylighting_controlled_lighting_power, :primary_side_daylighting_control_lighting_fraction, :primary_side_daylighting_illuminance_set_point, :secondary_side_daylighting_reference_point_coordinate, :secondary_side_daylighting_controlled_lighting_power, :secondary_side_daylighting_control_lighting_fraction, :secondary_side_daylighting_illuminance_set_point, :daylighting_control_type, :minimum_dimming_light_fraction, :minimum_dimming_power_fraction, :number_of_control_steps, :glare_azimuth, :maximum_glare_index, :skylight_requirement_exception, :skylight_requirement_exception_area, :skylight_requirement_exception_fraction, :receptacle_power_density, :receptacle_schedule_reference, :receptacle_radiation_fraction, :receptacle_latent_fraction, :receptacle_lost_fraction, :gas_equipment_power_density, :gas_equipment_schedule_reference, :gas_equipment_radiation_fraction, :gas_equipment_latent_fraction, :gas_equipment_lost_fraction, :process_electrical_power_density, :process_electrical_schedule_reference, :process_electrical_radiation_fraction, :process_electrical_latent_fraction, :process_electrical_lost_fraction, :process_gas_power_density, :process_gas_schedule_reference, :process_gas_radiation_fraction, :process_gas_latent_fraction, :process_gas_lost_fraction, :commercial_refrigeration_epd, :commercial_refrigeration_equipment_schedule_reference, :commercial_refrigeration_radiation_fraction, :commercial_refrigeration_latent_fraction, :commercial_refrigeration_lost_fraction, :elevator_count, :elevator_power, :elevator_schedule_reference, :elevator_radiation_fraction, :elevator_latent_fraction, :elevator_lost_fraction, :escalator_count, :escalator_power, :escalator_schedule_reference, :escalator_radiation_fraction, :escalator_latent_fraction, :escalator_lost_fraction, :shw_fluid_segment_reference, :recirculation_dhw_system_reference, :hot_water_heating_rate, :recirculation_hot_water_heating_rate, :hot_water_heating_schedule_reference, :ventilation_per_person, :ventilation_per_area, :ventilation_air_changes_per_hour, :ventilation_per_space, :exhaust_per_area, :exhaust_air_changes_per_hour, :exhaust_per_space, :kitchen_exhaust_hood_length, :kitchen_exhaust_hood_style, :kitchen_exhaust_hood_duty, :kitchen_exhaust_hood_flow, :lab_exhaust_rate_type, :interior_lighting_power_density_prescriptive, :is_plenum_return, :high_rise_residential_integer, :high_rise_residential_conditioned_floor_area, surfaces: [:id, :name, :adjacent_space, :surface_type, :area, :azimuth, :boundary, :construction, :perimeter_exposed, :tilt, :type, :height, subsurfaces: [:id, :name, :area, :construction, :type]]])
    end
end
