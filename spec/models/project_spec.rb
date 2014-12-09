require 'rails_helper'

describe Project do

  it 'should create a project and save it to xml' do
    p = Project.new
    p.zip_code = 80305
    p.building = Building.new
    # add stories
    p.building.total_story_count = 2
    p.building.above_grade_story_count = 2
    p.save
    p.building.save

    p.building.building_stories.build(name: 'story1', floor_to_floor_height: 10.7, z: 0)
    p.building.building_stories.build(name: 'story2', floor_to_ceiling_height: 10, z: 0)

    # add spaces in each story
    p.building.building_stories.each_with_index do |story, index|
      story.spaces.build(name: "spc#{index}", area: 5000, space_function: 'Office (Greater than 250 square feet in floor area)')
    end
    # add exterior walls on spaces
    p.building.building_stories.spaces.each_with_index do |spc, index|
      spc.exterior_walls.build(name: "south_wall#{index}", area: 1000)
      spc.exterior_walls.build(name: "north_wall#{index}", area: 1000)
      spc.exterior_walls.build(name: "east_wall#{index}", area: 500)
      spc.exterior_walls.build(name: "west_wall#{index}", area: 500)
    end
    p.save
    p.to_sdd_xml

  end
end