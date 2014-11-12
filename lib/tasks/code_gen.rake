namespace :code_gen do
  desc "test code generation"
  task :run => :environment do
    `rails g scaffold ExampleModel --no-helper --no-assets --no-test-framework`
  end

  desc "generate scaffold from inputs"
  task :generate_scaffolds => :environment do

  	scaffolds = get_inputs

  	# for each scaffold do:
  	scaffolds.each do |s|
  		input = Input.find_by(name: s)
  		fields_str = ''
  		# make Controller name
  		controller_name = input.display_name

  		# always add a 'name:string' field
  		fields_str = 'name:string'
			num = 0
  		# get fields (in a string name: type)
  		input.data_fields.each do |df|

  			# only create fields marked as 'exposed'
  			
  			if df['exposed']
  				num += 1
	  			if df['data_type'].include? 'Array' 
	  				data_type = 'array'
	  			elsif df['data_type'].include? 'Enumeration'
	  				data_type = 'string'
	  			else 
	  				data_type = df['data_type'].downcase
	  			end

	  			fields_str = fields_str + ", #{df['db_field_name']}:#{data_type}"
	  		end
  		end

  		puts "Generating scaffold for #{controller_name} with #{num} fields"
  		
  		# call generate scaffold  (use -f to force/overwrite)
 			output = `rails g scaffold #{controller_name} #{fields_str} --force --no-helper --no-assets --no-test-framework`

 			puts "Output of generate command: #{output}"
 			puts '***************'
  	end
  end

  desc "add enums to models"
  task :generate_enumerations => :environment do

  	scaffolds = get_inputs

  	# get exposed inputs which are Enumerations and not set as constant
  	scaffolds.each do |s|
  		enums = []
  		input = Input.find_by(name: s)

  		# find enums
  		input.data_fields.each do |df|

  			# find enumerations
 				if df['data_type'] == 'Enumeration'
  				if df['exposed'] and !df['set_as_constant']
  					method_str = "\n\tdef get_#{df['db_field_name']}_enums\n\t\t[\n"
  					df['enumerations'].each do |e|
  						method_str = method_str + "\t\t\t'#{e['name']}',\n"
  					end
  					method_str = method_str.chop.chop
  					method_str = method_str + "\n\t\t]\n\tend\n"
  					enums << method_str
  					#puts df['name']
  					#puts method_str
  					#puts "************"

  				end
  			end
  		end

  		# write to file
  		File.open("#{Rails.root}/app/models/#{input.display_name.downcase}-tmp.rb", 'w') do |out| # 'w' for a new file, 'a' append to existing
			  File.open("#{Rails.root}/app/models/#{input.display_name.downcase}.rb", 'r') do |f|
			    f.each_line do |line|
				    unless line.strip == 'end'
				    	out.write(line)
					    if line.include? 'Mongoid::Document'
					      out.write("\tinclude Mongoid::Timestamps\n\n")
					    end
				    end
				  end
			  end
			  # write new stuff
			  enums.each do |e|
			  	out.write(e)
			  end
			  # write final end
			  out.write('end')
			end

			# replace files
			`rm #{Rails.root}/app/models/#{input.display_name.downcase}.rb`
			`mv #{Rails.root}/app/models/#{input.display_name.downcase}-tmp.rb #{Rails.root}/app/models/#{input.display_name.downcase}.rb`

  	end

	end

	desc "add sdd xml converter to models"
  task :generate_sdd_xml_writer	 => :environment do

  end

  def get_inputs
		# scaffolds = ['Proj', 'Bldg', 'Story', 'Spc']
  	['Proj', 'Bldg']
  end

end
