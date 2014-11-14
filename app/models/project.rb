class Project
  include Mongoid::Document
	include Mongoid::Timestamps

  field :name, type: String
  field :geometry_input_type, type: String
  field :climate_zone, type: String
  field :latitude, type: Float
  field :longitude, type: Float
  field :elevation, type: Float
  field :street_address, type: String
  field :city, type: String
  field :state, type: String
  field :zip_code, type: Integer
  field :owner_name, type: String
  field :owner_title, type: String
  field :owner_organization, type: String
  field :owner_email, type: String
  field :owner_phone, type: String
  field :architect_name, type: String
  field :architect_title, type: String
  field :architect_organization, type: String
  field :architect_email, type: String
  field :architect_phone, type: String
  field :hvac_engineer_name, type: String
  field :hvac_engineer_title, type: String
  field :hvac_engineer_organization, type: String
  field :hvac_engineer_email, type: String
  field :hvac_engineer_phone, type: String
  field :weather_station, type: String
  field :hvac_auto_sizing, type: Integer
  field :exceptional_condition_complete_building, type: String
  field :exceptional_condition_exterior_lighting, type: String
  field :exceptional_condition_no_cooling_system, type: String
  field :exceptional_condition_rated_capacity, type: String
  field :exceptional_condition_water_heater, type: String
  field :exceptional_condition_narrative, type: String
  field :run_title, type: String
  field :compliance_type, type: String
  field :compliance_report_pdf, type: Integer
  field :compliance_report_xml, type: Integer

	has_many :schedule_days
	has_many :schedule_weeks
	has_many :schedules
	has_many :construct_assemblies
	has_many :materials
	has_many :fenestration_constructions
	has_many :door_constructions
	has_many :space_function_defaults
	has_many :luminaires
	has_many :curve_linears
	has_many :curve_quadratics
	has_many :curve_cubics
	has_many :curve_double_quadratics
	has_one :building
	has_many :external_shading_objects


	def children_models
		children = [
			'schedule_day',
			'schedule_week',
			'schedule',
			'construct_assembly',
			'material',
			'fenestration_construction',
			'door_construction',
			'space_function_defaults',
			'luminaire',
			'curve_linear',
			'curve_quadratic',
			'curve_cubic',
			'curve_double_quadratic',
			'building',
			'external_shading_object'
		]
	end

	def xml_fields
		xml_fields = [
			'geometry_input_type',
			'climate_zone',
			'latitude',
			'longitude',
			'elevation',
			'street_address',
			'city',
			'state',
			'zip_code',
			'owner_name',
			'owner_title',
			'owner_organization',
			'owner_email',
			'owner_phone',
			'architect_name',
			'architect_title',
			'architect_organization',
			'architect_email',
			'architect_phone',
			'hvac_engineer_name',
			'hvac_engineer_title',
			'hvac_engineer_organization',
			'hvac_engineer_email',
			'hvac_engineer_phone',
			'weather_station',
			'hvac_auto_sizing',
			'exceptional_condition_complete_building',
			'exceptional_condition_exterior_lighting',
			'exceptional_condition_no_cooling_system',
			'exceptional_condition_rated_capacity',
			'exceptional_condition_water_heater',
			'exceptional_condition_narrative',
			'run_title',
			'compliance_type',
			'compliance_report_pdf',
			'compliance_report_xml'
		]
	end

	def to_sdd_xml
		builder = Nokogiri::XML::Builder.new do |xml|
			xml.send(:Proj) do
				xml_fields.each do |field|
					xml.send(:"#{field}", self[field])
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

	def climate_zone_enums
		[
			'- select -',
			'ClimateZone1',
			'ClimateZone2',
			'ClimateZone3',
			'ClimateZone4',
			'ClimateZone5',
			'ClimateZone6',
			'ClimateZone7',
			'ClimateZone8',
			'ClimateZone9',
			'ClimateZone10',
			'ClimateZone11',
			'ClimateZone12',
			'ClimateZone13',
			'ClimateZone14',
			'ClimateZone15',
			'ClimateZone16'
		]
	end

	def weather_station_enums
		[
			'- select -',
			'ALTURAS_725958',
			'ARCATA_725945',
			'BAKERSFIELD_723840',
			'BISHOP_724800',
			'BLUE-CANYON_725845',
			'BLYTHE-RIVERSIDE-CO_747188',
			'BURBANK-GLENDALE_722880',
			'CAMARILLO_723926',
			'CAMP-PENDLETON_722926',
			'CARLSBAD_722927',
			'CHINA-LAKE_746120',
			'CHINO_722899',
			'CONCORD_724936',
			'CRESCENT-CITY_725946',
			'DAGGETT-BARSTOW_723815',
			'EDWARDS-AFB_723810',
			'EL-CENTRO_722810',
			'EUREKA_725940',
			'FAIRFLD-TRAVIS-AFB_745160',
			'FRESNO_723890',
			'FULLERTON_722976',
			'HAWTHORNE-NORTHROP-FLD_722956',
			'HAYWARD_724935',
			'IMPERIAL_747185',
			'IMPERIAL-BEACH_722909',
			'INYOKERN_723826',
			'LANCASTER_723816',
			'LEMOORE_747020',
			'LIVERMORE_724927',
			'LOMPOC_722895',
			'LONG-BEACH_722970',
			'LOS-ALAMITOS_722975',
			'LOS-ANGELES-DOWNTOWN_722874',
			'LOS-ANGELES-INTL_722950',
			'MARYSVILLE-BEALE-AFB_724837',
			'MERCED_724815',
			'MODESTO_724926',
			'MOJAVE_722953',
			'MONTAGUE-SISKIYOU-CO_725955',
			'MONTEREY_724915',
			'MOUNT-SHASTA_725957',
			'NAPA-CO_724955',
			'NEEDLES_723805',
			'OAKLAND_724930',
			'OXNARD_723927',
			'PALMDALE_723820',
			'PALM-SPRINGS-INTL_722868',
			'PALM-SPRINGS-THERMAL_747187',
			'PALO-ALTO_724937',
			'PASO-ROBLES_723965',
			'POINT-MUGU_723910',
			'PORTERVILLE_723895',
			'RED-BLUFF_725910',
			'REDDING_725920',
			'RIVERSIDE_722869',
			'RIVERSIDE-MARCH-AFB_722860',
			'SACRAMENTO-EXECUTIVE_724830',
			'SACRAMENTO-METRO_724839',
			'SALINAS_724917',
			'SAN-CARLOS_724938',
			'SAN-CLEMENTE-IS_722925',
			'SANDBERG_723830',
			'SAN-DIEGO-GILLESPIE_722907',
			'SAN-DIEGO-LINDBERGH_722900',
			'SAN-DIEGO-MONTGOMER_722903',
			'SAN-DIEGO-NORTH-IS_722906',
			'SAN-FRANCISCO-INTL_724940',
			'SAN-JOSE-INTL_724945',
			'SAN-JOSE-REID_724946',
			'SAN-LUIS-CO_722897',
			'SAN-NICHOLAS-IS_722910',
			'SANTA-ANA_722977',
			'SANTA-BARBARA_723925',
			'SANTA-MARIA_723940',
			'SANTA-MONICA_722885',
			'SANTA-ROSA_724957',
			'SOUTH-LAKE-TAHOE_725847',
			'STOCKTON_724920',
			'TORRANCE_722955',
			'TRUCKEE-TAHOE_725846',
			'TWENTYNINE-PALMS_690150',
			'UKIAH_725905',
			'VANDENBERG-AFB_723930',
			'VAN-NUYS_722886',
			'VISALIA_723896',
			'YUBA-CO_724838'
		]
	end

	def exceptional_condition_complete_building_enums
		[
			'Yes',
			'No'
		]
	end

	def exceptional_condition_exterior_lighting_enums
		[
			'Yes',
			'No'
		]
	end

	def exceptional_condition_no_cooling_system_enums
		[
			'Yes',
			'No'
		]
	end

	def exceptional_condition_rated_capacity_enums
		[
			'Yes',
			'No'
		]
	end

	def exceptional_condition_water_heater_enums
		[
			'Yes',
			'No'
		]
	end

	def exceptional_condition_narrative_enums
		[
			'Yes',
			'No'
		]
	end

	def compliance_type_enums
		[
			'NewComplete',
			'NewEnvelope',
			'NewEnvelopeAndLighting',
			'NewEnvelopeAndPartialLighting',
			'NewMechanical',
			'NewMechanicalAndLighting',
			'NewMechanicalAndPartialLighting',
			'ExistingAddition',
			'ExistingAlteration',
			'ExistingAdditionAndAlteration'
		]
	end
end