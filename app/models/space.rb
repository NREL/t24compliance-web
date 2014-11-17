class Space
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :thermal_zone_reference, type: String
  field :area, type: Float
  field :space_function_defaults_reference, type: String
  field :space_function, type: String
  field :secondary_sidelit100_percent_controlled, type: Integer

	belongs_to :building_story
	has_many :interior_lighting_systems
	has_many :ceilings
	has_many :exterior_floors
	has_many :exterior_walls
	has_many :interior_floors
	has_many :interior_walls
	has_many :roofs
	has_many :underground_floors
	has_many :underground_walls
	has_many :external_shading_objects
	has_many :poly_loops


	def children_models
		children = [
			'interior_lighting_system',
			'ceiling',
			'exterior_floor',
			'exterior_wall',
			'interior_floor',
			'interior_wall',
			'roof',
			'underground_floor',
			'underground_wall',
			'external_shading_object',
			'poly_loop'
		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"status", "xml_field_name"=>"Status"},
			{"db_field_name"=>"thermal_zone_reference", "xml_field_name"=>"ThrmlZnRef"},
			{"db_field_name"=>"area", "xml_field_name"=>"Area"},
			{"db_field_name"=>"space_function_defaults_reference", "xml_field_name"=>"SpcFuncDefaultsRef"},
			{"db_field_name"=>"space_function", "xml_field_name"=>"SpcFunc"},
			{"db_field_name"=>"secondary_sidelit100_percent_controlled", "xml_field_name"=>"SecSide100PctControlled"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:Spc) do
			xml_fields.each do |field|
				xml.send(:"#{field['xml_field_name']}", self[field['db_field_name']])
			end
			# go through children if they have something to add, call their methods
			kids = self.children_models
			unless kids.nil? or kids.empty?
				kids.each do |k|
					models = self.send(k.pluralize)
					models.each do |m|
						m.to_sdd_xml(xml)
					end
				end
			end
		end
	end

	def status_enums
		[
			'New',
			'Existing',
			'Altered'
		]
	end

	def space_function_enums
		[
			'- specify -',
			'Unoccupied-Include in Gross Floor Area',
			'Unoccupied-Exclude from Gross Floor Area',
			'Auditorium Area',
			'Auto Repair Area',
			'Bar, Cocktail Lounge and Casino Areas',
			'Beauty Salon Area',
			'Classrooms, Lecture, Training, Vocational Areas',
			'Civic Meeting Place Area',
			'Commercial and Industrial Storage Areas (conditioned or unconditioned)',
			'Commercial and Industrial Storage Areas (refrigerated)',
			'Computer Room',
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
			'Kitchen, Commercial Food Preparation',
			'Kitchenette or Residential Kitchen',
			'Laboratory, Scientific',
			'Laboratory, Equipment Room',
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