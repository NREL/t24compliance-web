# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

SKIP_CONSTRUCTIONS = false
SKIP_FENESTRATION = false
SKIP_DOORS = false
SKIP_SPACES = false
SKIP_ZIP_CODES = false

u = User.find_or_create_by(email: 'test@nrel.gov')
u.roles = [:admin]
# Remove this if we share the code. This is very dangerous giving the admin a simple password for testing sake!
# only set password if it doesn't already exist
if u.encrypted_password.empty?
  u.password = 'password'
end
u.save!
# moved test project creation to sim.rake

unless SKIP_CONSTRUCTIONS
  # CONSTRUCTION LIBRARIES
  file = File.read(File.join(Rails.root, "lib/assets/construction_library.json"))
  data = JSON.parse(file)

  puts 'Importing Constructions'
  data['constructions'].each_with_index do |c, index|
    cons = Construction.find_or_create_by(name: c['name'])
    if cons
      puts "Adding/Updating Construction: #{cons.name}" if index % 100 == 0

      # Note that this is a one-way merge. It will not remove any fields that are in the current record instance that
      # need to be removed
      c = cons.as_json.merge(c)
      cons.update(c)
      cons.save!
    end
  end
end

unless SKIP_FENESTRATION
  file = File.read(File.join(Rails.root, "lib/assets/fenestration_library.json"))
  data = JSON.parse(file)

  puts 'Importing Fenestrations'
  data['default_fenestrations'].each_with_index do |c, index|
    fens = Fenestration.find_or_create_by(name: c['name'])
    if fens
      puts "Adding/Updating Fenestration: #{fens.name}" if index % 100 == 0

      # Note that this is a one-way merge. It will not remove any fields that are in the current record instance that
      # need to be removed
      c = fens.as_json.merge(c)
      # don't need these 2 fields
      c.extract!('gas_fill')
      c.extract!('low_emissivity_coating')
      fens.update(c)
      fens.save!
    end
  end
end

unless SKIP_DOORS
  file = File.read(File.join(Rails.root, "lib/assets/door_construction_library.json"))
  data = JSON.parse(file)

  puts 'Importing Door Constructions'
  data['door_constructions'].each_with_index do |c, index|
    door = DoorLookup.find_or_create_by(name: c['name'])
    if door
      puts "Adding/Updating Door: #{door.name}" if index % 100 == 0

      # Note that this is a one-way merge. It will not remove any fields that are in the current record instance that
      # need to be removed
      c = door.as_json.merge(c)
      door.update(c)
      door.save!
    end
  end
end


unless SKIP_SPACES
# SPACE TYPE DEFAULTS
  file = File.read(File.join(Rails.root, "lib/assets/space_function_library.json"))
  data = JSON.parse(file)

  puts 'Importing Spaces'
  data['space_functions'].each_with_index do |c, index|
    sf = SpaceFunctionDefault.find_or_create_by(name: c['name'])
    if sf
      puts "Adding/Updating Space Function Default: #{sf.name}" if index % 100 == 0

      # Note that this is a one-way merge. It will not remove any fields that are in the current record instance that
      # need to be removed
      c = sf.as_json.merge(c)
      sf.update(c)
      sf.save!
    end
  end
end

unless SKIP_ZIP_CODES
  file = File.read(File.join(Rails.root, "lib/assets/zip_codes.json"))
  data = JSON.parse(file)

  puts 'Importing Zip Codes'
  data['zip_codes'].each_with_index do |c, index|
    zips = ZipCodes.find_or_create_by(state: c['state'])
    if zips
      puts "Adding/Updating Zip Codes: #{zips.state}" if index % 100 == 0

      # Note that this is a one-way merge. It will not remove any fields that are in the current record instance that
      # need to be removed
      c = zips.as_json.merge(c)
      zips.update(c)
      zips.save!
    end
  end
end


