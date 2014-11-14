class Holiday
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :specification_method, type: String
  field :day_of_week, type: String
  field :month, type: String
  field :day, type: Integer



	def children_models
		children = [

		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"specification_method", "xml_field_name"=>"SpecMthd"},
			{"db_field_name"=>"day_of_week", "xml_field_name"=>"DayOfWeek"},
			{"db_field_name"=>"month", "xml_field_name"=>"Month"},
			{"db_field_name"=>"day", "xml_field_name"=>"Day"}
		]
	end

	def to_sdd_xml
		builder = Nokogiri::XML::Builder.new do |xml|
			xml.send(:Hol) do
				xml_fields.each do |field|
					xml.send(:"#{field['xml_field_name']}", self[field['db_field_name']])
				end
				# go through children if they have something to add, call their methods
				kids = self.children_models
				unless kids.nil? or kids.empty?
					kids.each do |k|
						if k == 'building'
							xml << self.building
						else
							models = self[k.pluralize]
							models.each do |m|
								xml << m.to_sdd_xml
							end
						end
					end
				end
			end
		end
		builder.to_xml
	end

	def specification_method_enums
		[
			'Date',
			'First',
			'Second',
			'Third',
			'Fourth',
			'Last'
		]
	end

	def day_of_week_enums
		[
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
			'Sunday'
		]
	end

	def month_enums
		[
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		]
	end
end