require 'rails_helper'

describe Project do
  before :all do
    Project.destroy_all

    f = File.join(Rails.root,"spec/files/cbecc_com_instances/0200016-OffSml-SG-BaseRun.xml")
    p = Project.from_sdd_xml(f)
  end

  it 'should have loaded the xml' do
    p = Project.where(name: '0200016-OffSml-SG-BaseRun').first
    expect(p).not_to be nil

    puts p.building.building_stories.inspect

    expect(p.building.building_stories.first.name).to eq "Building Story 1"
  end

  it 'should create a project programmatically and save it to xml' do
    p = Project.new
    p.zip_code = 80305
    p.building = Building.new
    # add stories
    p.building.total_story_count = 2
    p.building.above_grade_story_count = 2
    p.save
    p.building.save

    p.building.building_stories.build(name: 'story1', floor_to_floor_height: 10.7, z: 0)
    p.building.building_stories.build(name: 'story2', floor_to_ceiling_height: 10, z: 10)

    # add spaces in each story
    p.building.building_stories.each_with_index do |story, index|
      s = story.spaces.build(name: "spc#{index}", area: 5000, space_function: 'Office (Greater than 250 square feet in floor area)')
      s.save
    end
    # add exterior walls on spaces
    p.building.building_stories.each do |story|
      story.spaces.each_with_index do |spc, index|
        spc.exterior_walls.build(name: "south_wall#{index}", area: 1000)
        spc.exterior_walls.build(name: "north_wall#{index}", area: 1000)
        spc.exterior_walls.build(name: "east_wall#{index}", area: 500)
        spc.exterior_walls.build(name: "west_wall#{index}", area: 500)
      end
    end
    expect(p.save!).to eq true

    # parse the XML and make sure that it has the values as expected
    h = Hash.from_xml(p.to_sdd_xml)
    expect(h['Proj']['ZipCode']).to eq '80305'
    expect(h['Proj']['Bldg']['TotStoryCnt']).to eq '2'
    expect(h['Proj']['Bldg']['Story'].first['Name']).to eq 'story1'
  end
end


# load the xml from the xml
describe Project do

end