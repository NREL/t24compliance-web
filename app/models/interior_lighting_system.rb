class InteriorLightingSystem
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :parent_space_function, type: String

	belongs_to :space


	def children_models
		children = [

		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"status", "xml_field_name"=>"Status"},
			{"db_field_name"=>"parent_space_function", "xml_field_name"=>"ParentSpcFunc"}
		]
	end

	def to_sdd_xml
		builder = Nokogiri::XML::Builder.new do |xml|
			xml.send(:IntLtgSys) do
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

	def status_enums
		[
			'New',
			'Altered',
			'Existing',
			'Future'
		]
	end

	def parent_space_function_enums
		[
			'- specify -',
			'Auditorium Area',
			'Auto Repair Area',
			'Bar, Cocktail Lounge and Casino Areas',
			'Beauty Salon Area',
			'Classrooms, Lecture, Training, Vocational Areas',
			'Civic Meeting Place Area',
			'Commercial and Industrial Storage Areas (conditioned or unconditioned)',
			'Commercial and Industrial Storage Areas (refrigerated)',
			'Convention, Conference, Multipurpose and Meeting Center Areas',
			'Corridors, Restrooms, Stairs, and Support Areas',
			'Dining Area',
			'Dry Cleaning (Coin Operated)',
			'Dry Cleaning (Full Service Commercial)',
			'Electrical, Mechanical, Telephone Rooms',
			'Exercise Center, Gymnasium Areas',
			'Exhibit, Museum Areas',
			'Financial Transaction Area',
			'General Commercial and Industrial Work Areas, High Bay',
			'General Commercial and Industrial Work Areas, Low Bay',
			'General Commercial and Industrial Work Areas, Precision',
			'Grocery Sales Areas',
			'High-Rise Residential Living Spaces',
			'Hotel Function Area',
			'Hotel/Motel Guest Room',
			'Housing, Public and Common Areas',
			'Housing, Public and Common Areas',
			'Kitchenette or Residential Kitchen',
			'Laundry',
			'Library, Reading Areas',
			'Library, Stacks',
			'Lobby, Hotel',
			'Lobby, Main Entry',
			'Locker/Dressing Room',
			'Lounge, Recreation',
			'Malls and Atria',
			'Medical and Clinical Care',
			'Office (Greater than 250 square feet in floor area)',
			'Office (250 square feet in floor area or less)',
			'Parking Garage Building, Parking Area',
			'Parking Garage Area Dedicated Ramps',
			'Parking Garage Area Daylight Adaptation Zones',
			'Police Station and Fire Station',
			'Religious Worship Area',
			'Retail Merchandise Sales, Wholesale Showroom',
			'Sports Arena, Indoor Playing Area',
			'Theater, Motion Picture',
			'Theater, Performance',
			'Transportation Function',
			'Videoconferencing Studio',
			'Waiting Area'
		]
	end
end