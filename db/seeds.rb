# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

SKIP_CONSTRUCTIONS = true
SKIP_SPACES = false

u = User.find_or_create_by(email: 'test@nrel.gov')
u.roles = [:admin]

# Remove this if we share the code. This is very dangerous giving the admin a simple password for testing sake!
u.password = 'password'
u.save!

u.projects.destroy_all

unless SKIP_CONSTRUCTIONS
# CONSTRUCTION LIBRARIES
  file = File.read(File.join(Rails.root, "lib/assets/construction_library.json"))
  data = JSON.parse(file)

  data['constructions'].each_with_index do |c, index|
    cons = Construction.find_or_create_by(name: c['name'])
    if cons
      puts "Adding/Updating Construction: #{cons.name}"

      # Note that this is a one-way merge. It will not remove any fields that are in the current record instance that
      # need to be removed
      c = cons.as_json.merge(c)
      cons.update(c)
      cons.save!
    end
  end

  file = File.read(File.join(Rails.root, "lib/assets/fenestration_library.json"))
  data = JSON.parse(file)

  data['constructions'].each_with_index do |c, index|
    fens = Fenestration.find_or_create_by(name: c['name'])
    if fens
      puts "Adding/Updating Fenestration: #{fens.name}"

      # Note that this is a one-way merge. It will not remove any fields that are in the current record instance that
      # need to be removed
      c = fens.as_json.merge(c)
      fens.update(c)
      fens.save!
    end
  end
end

unless SKIP_SPACES
# SPACE TYPE DEFAULTS
  file = File.read(File.join(Rails.root, "lib/assets/space_function_library.json"))
  data = JSON.parse(file)

  data['space_functions'].each_with_index do |c, index|
    sf = SpaceFunctionDefault.find_or_create_by(name: c['name'])
    if sf
      puts "Adding/Updating Space Function Default: #{sf.name}"

      # Note that this is a one-way merge. It will not remove any fields that are in the current record instance that
      # need to be removed
      c = sf.as_json.merge(c)
      sf.update(c)
      sf.save!
    end
  end
end

# import some cbecc com models
f = File.join(Rails.root, "spec/files/cbecc_com_instances/0200016-OffSml-SG-BaseRun.xml")
p = Project.from_sdd_xml(f)
p.user_id = u.id
p.save!
puts p

#h = Hash.from_xml(file)
#File.open('spec/files/cbecc_com_instances/0200016-OffSml-SG-BaseRun.json','w') {|f| f << MultiJson.dump(h, :pretty => true)}
