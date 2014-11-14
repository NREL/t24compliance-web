namespace :code_gen do
  desc "test code generation"
  task :run => :environment do
    `rails g scaffold ExampleModel --no-helper --no-assets --no-test-framework`
  end

  desc "generate scaffold from inputs"
  task :generate_scaffolds => :environment do

  	scaffolds = inputs_to_scaffold

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

  			# only create fields marked as 'exposed' or 'set_as_constant'
  			
  			if df['exposed'] or df['set_as_constant']
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

  desc "add enums, timestamps, and relationships to model.rb"
  task :add_model_extras => :environment do

  	scaffolds = inputs_to_scaffold

  	scaffolds.each do |s|

  		input = Input.find_by(name: s)

  		# rewrite model file
  		File.open("#{Rails.root}/app/models/#{input.display_name.singularize.underscore}-tmp.rb", 'w') do |out| # 'w' for a new file, 'a' append to existing
			  File.open("#{Rails.root}/app/models/#{input.display_name.singularize.underscore}.rb", 'r') do |f|
			    f.each_line do |line|
				    unless line.strip == 'end'
				    	# don't print the last comma
				    	out.write(line.gsub(/,$/, ''))
				    	# add mongoid timestamps
					    if line.include? 'Mongoid::Document'
					      out.write(mongoid_timestamps)
					    end
				    end
				  end
			  end

			  # add relationships
			  out.write(generate_relationships(input))

			  # add children
			  out.write(generate_children(input))

			  # add xml fields
			  out.write(generate_xml_fields_list(input))

			  # add sdd_xml
			  out.write(generate_sdd_xml(input))

			  # add xml_save on Project model only
			  out.write(generate_xml_save(input))

			  # write enums
  			enums = generate_enumerations(input)
			  enums.each do |e|
			  	out.write(e)
			  end

			  # write final end
			  out.write('end')
			end

			# replace files
			`rm #{Rails.root}/app/models/#{input.display_name.singularize.underscore}.rb`
			`mv #{Rails.root}/app/models/#{input.display_name.singularize.underscore}-tmp.rb #{Rails.root}/app/models/#{input.display_name.singularize.underscore}.rb`

  	end

	end

  # HELPER METHODS

  def inputs_to_scaffold

  	# ['Proj', 'Bldg']	

  	scaffolds = []
  	inputs = Input.all 
  	inputs.each do |input|
  		scaffolds << input.name
  	end

  	scaffolds
  end

  def mongoid_timestamps

		"\tinclude Mongoid::Timestamps\n"
  
  end

  # used by generate_xml_fields_list and generate_sdd_xml
  def xml_fields(input)

  	xml_fields = []
  	input.data_fields.each do |df|
  		f_hash = {}
  		if df['exposed'] or df['set_as_constant']
  			f_hash['db_field_name'] = df['db_field_name']
  			f_hash['xml_field_name'] = df['name'] 
  			xml_fields << f_hash
  		end
  	end
  	xml_fields
  end

  def children(input)
  	kids = []
  	unless input.children.nil?
  		input.children.each do |c|
  			k_hash = {}
  			model = Input.find_by(name: c)
  			k_hash['xml_name'] = model.name
  			k_hash['model_name'] = model.display_name.singularize.underscore
  			kids << k_hash
  		end
  	end
  	kids
  end

  def generate_xml_fields_list(input)
  	xml_str = "\n\tdef xml_fields\n"
  	xml_str = xml_str + "\t\txml_fields = [\n"

  	xml_fields = xml_fields(input)
  	unless xml_fields.nil? or xml_fields.empty?
	  	xml_fields.each do |f|
	  		xml_str = xml_str + "\t\t\t#{f},\n"
	  	end
	  	# remove last comma
	  	xml_str = xml_str.chop.chop
	  end
  	xml_str = xml_str + "\n\t\t]\n"
  	xml_str = xml_str + "\tend\n\n"
  end

  def generate_children(input)
  	kids_str =  "\n\tdef children_models\n"
  	kids_str = kids_str + "\t\tchildren = [\n"
  	kids = children(input)
  	unless kids.nil? or kids.empty?
  		kids.each do |k|
  			kids_str = kids_str + "\t\t\t'" + k['model_name'] + "',\n"
  		end
  		kids_str = kids_str.chop.chop
  	end
  	kids_str = kids_str + "\n\t\t]\n\tend\n"
  end

  def generate_sdd_xml(input)
  	# TODO:  also call children's methods, if any
  	sdd_str = "\tdef to_sdd_xml\n"
  	sdd_str = sdd_str + "\t\t" + "builder = Nokogiri::XML::Builder.new do |xml|\n"
  	sdd_str = sdd_str + "\t\t\t" + "xml.send(:""#{input.name}"") do" + "\n"
  	sdd_str = sdd_str + "\t\t\t\t" +  "xml_fields.each do |field|" + "\n"
  	sdd_str = sdd_str + "\t\t\t\t\t" + "xml.send(:" + '"#{field[\'xml_field_name\']}"' + ", self[field['db_field_name']])" + "\n"
  	sdd_str = sdd_str + "\t\t\t\t" + "end" + "\n"
  	sdd_str = sdd_str + "\t\t\t\t" + "# go through children if they have something to add, call their methods\n"
  	sdd_str = sdd_str + "\t\t\t\t" + "kids = self.children_models" + "\n"
  	sdd_str = sdd_str + "\t\t\t\t" + "unless kids.nil? or kids.empty?" + "\n"
  	sdd_str = sdd_str + "\t\t\t\t\t" + "kids.each do |k|" + "\n"
  	sdd_str = sdd_str + "\t\t\t\t\t\t" + "if k == 'building'\n"
  	sdd_str = sdd_str + "\t\t\t\t\t\t\t" + "xml << self.building\n"
  	sdd_str = sdd_str + "\t\t\t\t\t\t"	+ "else\n"
  	sdd_str = sdd_str + "\t\t\t\t\t\t\t" + "models = self[k.pluralize]"	 + "\n"
  	sdd_str = sdd_str + "\t\t\t\t\t\t\t" + "models.each do |m|\n"
  	sdd_str = sdd_str + "\t\t\t\t\t\t\t\t" + "xml << m.to_sdd_xml\n"
  	sdd_str = sdd_str + "\t\t\t\t\t\t\t" + "end\n"
  	sdd_str = sdd_str + "\t\t\t\t\t\t" + "end\n"
  	sdd_str = sdd_str + "\t\t\t\t\t" + "end\n"
  	sdd_str = sdd_str + "\t\t\t\t" + "end\n"
  	sdd_str = sdd_str + "\t\t\t" + "end\n"
  	sdd_str = sdd_str + "\t\t" + "end\n"
  	sdd_str = sdd_str + "\t\t" + "builder.to_xml" + "\n"
  	sdd_str = sdd_str + "\tend\n"

  end

  def generate_xml_save(input)
  	if input.name == 'Proj'
  		# only need this method on the Project model
  		str = "\tdef xml_save\n"
  		str = str + "\t\txml = self.to_sdd_xml" + "\n"
  		str = str + "\t\t" + 'File.open("#{Rails.root}/data/xmls/#{self.id}.xml", "w") do |f|' + "\n"
  		str = str + "\t\t\tf << xml" + "\n"
  		str = str + "\t\tend\n"
  		str = str + "\tend\n"
  	end
  end

  def generate_relationships(input)
  	relations_str = "\n"

  	unless input.parents.nil?
	  	input.parents.each do |p|
	  		model = Input.find_by(name: p)
	  		relations_str = relations_str + "\tbelongs_to :#{model.display_name.singularize.underscore}\n"
	  	end
	  end
	  unless input.children.nil?
	  	input.children.each do |c|
	  		model = Input.find_by(name: c)
	  		if c == 'Bldg'
	  			relations_str = relations_str + "\thas_one :" + model.display_name.singularize.underscore + "\n"
	  		else
	  			relations_str = relations_str + "\thas_many :" + model.display_name.underscore.pluralize + "\n"
	  		end
	  	end
	  end
  	
	  # check for missing relationships (some belongs_to are missing on the children models)
	  relationships = add_missing_relationships
	  relationships.each do |r|
	  	if r['name'] == input.display_name.singularize.underscore
	  		relations_str = relations_str + "\t" + r['relation'] + "\n"
	  	end
	  end

  	relations_str = relations_str + "\n"
  end

  def add_missing_relationships

  	# model to apply to => relationship to add
  	relationships = [
  		{'name' => 'building', 'relation' =>  "belongs_to :project"},
  		{'name' => 'schedule_day', 'relation' =>  "belongs_to :project"},
  		{'name' => 'schedule_week', 'relation' =>  "belongs_to :project"},
  		{'name' => 'schedule', 'relation' =>  "belongs_to :project"},
  		{'name' => 'construct_assembly', 'relation' =>  "belongs_to :project"},
			{'name' => 'material', 'relation' =>  "belongs_to :project"},
			{'name' => 'fenestration_construction', 'relation' =>  "belongs_to :project"},
			{'name' => 'door_construction', 'relation' =>  "belongs_to :project"},
			{'name' => 'space_function_default', 'relation' =>  "belongs_to :project"},
			{'name' => 'luminaire', 'relation' =>  "belongs_to :project"},
			{'name' => 'curve_linear', 'relation' =>  "belongs_to :project"},
			{'name' => 'curve_quadratic', 'relation' =>  "belongs_to :project"},
			{'name' => 'curve_cubic', 'relation' =>  "belongs_to :project"},
			{'name' => 'curve_double_quadratic','relation' =>  "belongs_to :project"},
			{'name' => 'external_shading_object','relation' => "belongs_to :project"}
  	]
  end

  def generate_enumerations(input)

  	# get exposed inputs which are Enumerations and not set as constant
		enums = []

		# find enums
		input.data_fields.each do |df|

			# find enumerations
				if df['data_type'] == 'Enumeration'
				if df['exposed'] and !df['set_as_constant']
					method_str = "\n\tdef #{df['db_field_name']}_enums\n\t\t[\n"
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
		enums
  end

end
