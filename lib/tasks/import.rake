namespace :import do

  desc "import input fields"
  task :input_fields => :environment do

  	filename = File.join(Rails.root,"lib/assets/cbecc_com13_input_data_model.txt")
  	
  	# current mongo object
   	obj = nil


		File.open(filename, 'r:iso-8859-1').each_line.with_index do |line, index|

			# first line is on row 3 (using 0-index)
			# 0 spaces:  	top-level object (ex: Proj, Bldg, ConsAssm, Mat, etc).  There should be 16?
			# 0 spaces and '--------------------': close out previous top-level: new one starts on next line
			# 6 spaces:  	field associated with top-level object
			# 38 spaces: 	default value (for enumeration fields)
			# 44 spaces: 	Enumeration value
			# 31 spaces:  Dependent select (enum values depend on other field) Should be "When [clause]" or "else"
			# 31 spaces:  Store data if it starts with 'Children:' or 'Parent(s):'

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
					puts "Top-Level found: #{line}"
					unless obj.nil?
						#save previous
						obj.save!
					end
					obj = Input.new
					data = line.scan(/\w+/) 
					obj.name = data[0]
					obj.display_name = data[1]
					puts line.gsub(data[1], '').gsub(data[0], '').strip
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
						end
					else
					end # end case

				end	# end if num_spaces == 0
			end # end index > 2

		end # end file loop

		# save last object
		unless obj.nil?
			obj.save!
		end

  end
end

