namespace :code_gen do
  desc "test code generation"
  task :run => :environment do
    `rails g scaffold ExampleModel --no-helper --no-assets --no-test-framework`
  end

  desc "generate scaffold from inputs"
  task :generate_scaffolds => :environment do

  	# *** NOTES ***
  	# Things that must still be done manually:  
  	# 1. adding mongoid Timestamps to each model
  	# 2. adding enumeration lists in each model.rb file



  	# start with these:
  	# scaffolds = ['Proj', 'Bldg', 'Story', 'Spc']
  	scaffolds = ['Proj']

  	# for each scaffold do:
  	scaffolds.each do |s|
  		input = Input.find_by(name: s)
  		fields_str = ''
  		# make Controller name
  		controller_name = input.display_name

  		# always add a 'name:string' field
  		fields_str = 'name:string'

  		# get fields (in a string name: type)
  		input.data_fields.each do |df|
  			if df['data_type'].include? 'Array' 
  				data_type = 'array'
  			elsif df['data_type'].include? 'Enumeration'
  				data_type = 'string'
  			else 
  				data_type = df['data_type'].downcase
  			end

  			fields_str = fields_str + ", #{df['db_field_name']}:#{data_type}"

  		end

  		puts "#{controller_name}: generating with #{input.data_fields.count} fields"
  		# puts "STRING: #{fields_str}"
  		

  		# call generate scaffold  (use -f to force/overwrite)
 			output = `rails g scaffold #{controller_name} #{fields_str} --force --no-helper --no-assets --no-test-framework`

 			puts "Output of generate command: #{output}"
 			puts '***************'
  	end


  end

end
