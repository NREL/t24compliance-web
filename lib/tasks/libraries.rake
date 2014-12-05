namespace :libraries do

  desc "import constructions"
  task :import_constructions => :environment do

  	file = File.read(File.join(Rails.root,"lib/assets/construction_library.json"))
  	data = JSON.parse(file)

  	data['constructions'].each_with_index do |c, index|
  		cons = Construction.new(c)
  		cons.save
  	end
  end

end