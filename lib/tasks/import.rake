namespace :import do

  desc "import input fields"
  task :input_fields => :environment do

  	filename = File.join(Rails.root,"lib/assets/cbecc_com13_input_data_model.txt")
  	
  	# current mongo object
   	obj = nil
   	# data_fields array
   	data_fields = []
   	# field hash
   	field = {}
   	# ignore_enums
   	ignore_enums = false


		File.open(filename, 'r:iso-8859-1').each_line.with_index do |line, index|

			# first line is on row 3 (using 0-index)
			# 0 spaces:  	top-level object (ex: Proj, Bldg, ConsAssm, Mat, etc).  There should be 16?
			# 0 spaces and '--------------------': close out previous top-level: new one starts on next line
			# 6 spaces:  	field associated with top-level object
			# 38 spaces: 	default value (for enumeration fields)
			# 42,44 spaces: 	Enumeration value (depending on 1, 2, or 3 digit IDs)
			# 31 spaces:  Dependent select (enum values depend on other field) Should be "When [clause]" or "else"
			# 31 spaces:  Store data if it starts with 'Children:' or 'Parent(s):'

			# TODO:  this will not pull in enumerations that do not have an 'else' state.  Must import those separated.
			# Example:  Space -> InteriorLightingSpecificationMethod

			# puts index

			if index > 2
				
				#if index == 2186
				# puts "space at beginning: #{line[/\A */].size}"
				# puts "line: #{line}"
				#end

				num_spaces = line[/\A */].size
				# puts "Num spaces: #{num_spaces}"

				# count top-levels
				if num_spaces == 0 && line[0..19] != '--------------------' && !line.blank?
					#puts "Top-Level found: #{line}"
					unless obj.nil?
						# TODO: don't forget to push last field and add data_fields to obj before saving 
						# save previous
						if !field.empty?
							data_fields << field
							field = {}
						end
						obj.data_fields = data_fields
						obj.save!
					end
					ignore_enums = false
					
					data_fields = []
					data = line.scan(/\w+/) 
					obj = Input.find_or_create_by(name: data[0])
					puts "Object found: #{obj.name}"
					obj.display_name = data[1]

					# gsub order matters here
					obj.notes = line.gsub(data[1], '').gsub(data[0], '').strip

				else
					# case statements for # of spaces	
					case num_spaces
					when  31
						# remove spaces & endofline characters
						if line.strip.start_with?('Parent(s)')
							obj.parents = line.gsub('Parent(s):', '').delete(' ').gsub(/\r\n/,'').split('/')
						elsif line.strip.start_with?('Children')
							obj.children = line.gsub('Children:', '').delete(' ').gsub(/\r\n/, '').split('/')
						elsif line.strip.start_with?('When')
							# ignore these enums (subset)
							ignore_enums = true
							field['conditional_logic'] = true
							# puts "Ignoring enums for line: #{line}"
						elsif line.strip.start_with?('else')
							# store these enums (full set)
							ignore_enums = false
							# puts "Storing enums for line: #{line}"
						end
					when 6
						# start a field associated with this top-level
						# first save previous field
						if !field.empty?
							data_fields << field
							field = {}
						end
						ignore_enums = false

						data = line.scan(/\w+/) 
						field['name'] = data[0]
						field['display_name'] = data[1]
						field['db_field_name'] = data[1].underscore

						# find if data is array, and # of values
						if line.include?('#Vals:')
							# puts "Line includes #Vals: #{line}"
							num_vals = line.match(/#Vals:\s+\d+/)[0]
							num_vals = num_vals.gsub('#Vals:', '').strip

							field['data_type'] = data[2] + ' Array'
							field['array_length'] = num_vals
						else
							field['data_type'] = data[2]
						end

						# input type
						field['input_type'] = data.find_index('input').nil? ? nil : data[data.find_index('input')-1]

						# units
						field['units'] = line[/Units:(.*)input/,1]
						#puts " line #{index}, Units: #{field['units']}"
						unless field['units'].nil?
							field['units'] = field['units'].gsub(field['input_type'], '').strip
						end

						# validation (everything after input)
						field['validation'] = line[/input(.*)/,1]
            field['validation'].chomp!.strip! if field['validation']

            # add existing NREL fields
            if obj.data_fields
	            obj.data_fields.each do |df|
	            	if df['name'] == field['name']
	            		field['exposed'] = df['exposed']
	            		field['set_as_constant'] = df['set_as_constant']
	            		field['constant_value'] = df['constant_value']
	            		field['comments'] = df['comments']
	            	end
	            end
	          end
						# TODO: other field before units?
					when 38
						# store default value
						unless field.empty? and ignore_enums
							field['default_value_id'] = line[/default:(.*)/,1].strip
						end
					when 42, 43, 44
						unless ignore_enums
							# store enumerations
							if !field['enumerations']
								field['enumerations'] = []
							end
							data = line.split(':')
							enum_hash = {}
							enum_hash['cbecc_id'] = data[0].strip
							enum_hash['name'] = data[1].gsub('"', '').strip
							field['enumerations'] << enum_hash
						end
					else
						# skip line
					end # end case

				end	# end if num_spaces == 0
			end # end index > 2

		end # end file loop

		# save last object
		unless obj.nil?
			if !field.empty?
				data_fields << field
				field = {}
			end
			obj.data_fields = data_fields
			obj.save!
		end

  end

  desc "fix broken enumerations"
  task :fix_broken_enums => :environment do

  	# Space -> InteriorLightingSpecificationMethod
	  input = Input.find_by(name: 'Spc')
	  input.data_fields.each do |df|
	  	if df['name'] == 'IntLtgSpecMthd'
	  		df['enumerations'] = []
	  		enum_hash = {}
	  		enum_hash['cbecc_id'] = '1'
				enum_hash['name'] = 'AreaCategoryMethod'
				df['enumerations'] << enum_hash
	  		df['conditional_logic'] = true
	  	end
	  end
	  input.save!
	  # IntLtgSys ->
	  # Space -> InteriorLightingSpecificationMethod
	  input = Input.find_by(name: 'IntLtgSys')
	  input.data_fields.each do |df|
	  	if df['name'] == 'IntLtgSpecMthd'
	  		df['enumerations'] = []
	  		enum_hash = {}
	  		enum_hash['cbecc_id'] = '1'
				enum_hash['name'] = 'AreaCategoryMethod'
				df['enumerations'] << enum_hash
	  		df['conditional_logic'] = true
	  	end
	  end
	  input.save!
	end

  desc "import input fields from json cache"
  task :input_fields_json => :environment do
    Input.import_from_json('lib/assets/cbecc_inputs.json')
  end
end

