class Project
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :building_energy_model_version, type: Integer
  field :geometry_input_type, type: String
  field :number_time_steps_per_hour, type: Integer
  field :permit_scope, type: String
  field :permit_month, type: Integer
  field :permit_day, type: Integer
  field :permit_year, type: Integer
  field :climate_zone_county, type: String
  field :climate_zone_number, type: Integer
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
  field :lighting_designer_name, type: String
  field :lighting_designer_title, type: String
  field :lighting_designer_organization, type: String
  field :lighting_designer_email, type: String
  field :lighting_designer_phone, type: String
  field :energy_modeler_name, type: String
  field :energy_modeler_title, type: String
  field :energy_modeler_organization, type: String
  field :energy_modeler_email, type: String
  field :energy_modeler_phone, type: String
  field :weather_station_number, type: Integer
  field :weather_station, type: String
  field :design_day_weather_file, type: String
  field :annual_weather_file, type: String
  field :weather_file_download_url, type: String
  field :site_fuel_type, type: String
  field :hvac_auto_sizing, type: Integer
  field :simulate_design_days, type: Integer
  field :run_period_begin_month, type: Integer
  field :run_period_begin_day, type: Integer
  field :run_period_end_month, type: Integer
  field :run_period_end_day, type: Integer
  field :run_period_year, type: Integer
  field :exceptional_condition_complete_building, type: String
  field :exceptional_condition_exterior_lighting, type: String
  field :exceptional_condition_no_cooling_system, type: String
  field :exceptional_condition_rated_capacity, type: String
  field :exceptional_condition_water_heater, type: String
  field :exceptional_condition_narrative, type: String
  field :disable_daylighting_controls, type: Integer
  field :default_daylighting_controls, type: Integer
  field :simulation_variables_site, type: Integer
  field :simulation_variables_thermal_zone, type: Integer
  field :simulation_variables_daylighting, type: Integer
  field :simulation_variables_hvac_secondary, type: Integer
  field :simulation_variables_hvac_primary, type: Integer
  field :simulation_variables_hvac_zone, type: Integer
  field :average_dry_bulb_temperature, type: Float
  field :monthly_average_temperature_maximum_difference, type: Float
  field :holiday_reference, type: Array
  field :run_title, type: String
  field :analysis_type, type: String
  field :compliance_type, type: String
  field :rule_report_type, type: String
  field :rule_report_file_append, type: String
  field :software_version, type: String
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
	has_many :simulations
	belongs_to :user


	def children_models
		children = [
			'schedule_day',
			'schedule_week',
			'schedule',
			'construct_assembly',
			'material',
			'fenestration_construction',
			'door_construction',
			'space_function_default',
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
			{"db_field_name"=>"building_energy_model_version", "xml_field_name"=>"BldgEngyModelVersion"},
			{"db_field_name"=>"geometry_input_type", "xml_field_name"=>"GeometryInpType"},
			{"db_field_name"=>"number_time_steps_per_hour", "xml_field_name"=>"NumTimeStepsPerHr"},
			{"db_field_name"=>"permit_scope", "xml_field_name"=>"PermitScope"},
			{"db_field_name"=>"permit_month", "xml_field_name"=>"PermitMonth"},
			{"db_field_name"=>"permit_day", "xml_field_name"=>"PermitDay"},
			{"db_field_name"=>"permit_year", "xml_field_name"=>"PermitYear"},
			{"db_field_name"=>"climate_zone_county", "xml_field_name"=>"CliZnCounty"},
			{"db_field_name"=>"climate_zone_number", "xml_field_name"=>"CliZnNum"},
			{"db_field_name"=>"climate_zone", "xml_field_name"=>"CliZn"},
			{"db_field_name"=>"latitude", "xml_field_name"=>"Lat"},
			{"db_field_name"=>"longitude", "xml_field_name"=>"Long"},
			{"db_field_name"=>"elevation", "xml_field_name"=>"Elevation"},
			{"db_field_name"=>"street_address", "xml_field_name"=>"StAddress"},
			{"db_field_name"=>"city", "xml_field_name"=>"City"},
			{"db_field_name"=>"state", "xml_field_name"=>"State"},
			{"db_field_name"=>"zip_code", "xml_field_name"=>"ZipCode"},
			{"db_field_name"=>"owner_name", "xml_field_name"=>"OwnerName"},
			{"db_field_name"=>"owner_title", "xml_field_name"=>"OwnerTitle"},
			{"db_field_name"=>"owner_organization", "xml_field_name"=>"OwnerOrg"},
			{"db_field_name"=>"owner_email", "xml_field_name"=>"OwnerEmail"},
			{"db_field_name"=>"owner_phone", "xml_field_name"=>"OwnerPhone"},
			{"db_field_name"=>"architect_name", "xml_field_name"=>"ArchName"},
			{"db_field_name"=>"architect_title", "xml_field_name"=>"ArchTitle"},
			{"db_field_name"=>"architect_organization", "xml_field_name"=>"ArchOrg"},
			{"db_field_name"=>"architect_email", "xml_field_name"=>"ArchEmail"},
			{"db_field_name"=>"architect_phone", "xml_field_name"=>"ArchPhone"},
			{"db_field_name"=>"hvac_engineer_name", "xml_field_name"=>"HVACEngrName"},
			{"db_field_name"=>"hvac_engineer_title", "xml_field_name"=>"HVACEngrTitle"},
			{"db_field_name"=>"hvac_engineer_organization", "xml_field_name"=>"HVACEngrOrg"},
			{"db_field_name"=>"hvac_engineer_email", "xml_field_name"=>"HVACEngrEmail"},
			{"db_field_name"=>"hvac_engineer_phone", "xml_field_name"=>"HVACEngrPhone"},
			{"db_field_name"=>"lighting_designer_name", "xml_field_name"=>"LtgDsgnrName"},
			{"db_field_name"=>"lighting_designer_title", "xml_field_name"=>"LtgDsgnrTitle"},
			{"db_field_name"=>"lighting_designer_organization", "xml_field_name"=>"LtgDsgnrOrg"},
			{"db_field_name"=>"lighting_designer_email", "xml_field_name"=>"LtgDsgnrEmail"},
			{"db_field_name"=>"lighting_designer_phone", "xml_field_name"=>"LtgDsgnrPhone"},
			{"db_field_name"=>"energy_modeler_name", "xml_field_name"=>"EnergyMdlrName"},
			{"db_field_name"=>"energy_modeler_title", "xml_field_name"=>"EnergyMdlrTitle"},
			{"db_field_name"=>"energy_modeler_organization", "xml_field_name"=>"EnergyMdlrOrg"},
			{"db_field_name"=>"energy_modeler_email", "xml_field_name"=>"EnergyMdlrEmail"},
			{"db_field_name"=>"energy_modeler_phone", "xml_field_name"=>"EnergyMdlrPhone"},
			{"db_field_name"=>"weather_station_number", "xml_field_name"=>"WeatherStationNum"},
			{"db_field_name"=>"weather_station", "xml_field_name"=>"WeatherStation"},
			{"db_field_name"=>"design_day_weather_file", "xml_field_name"=>"DDWeatherFile"},
			{"db_field_name"=>"annual_weather_file", "xml_field_name"=>"AnnualWeatherFile"},
			{"db_field_name"=>"weather_file_download_url", "xml_field_name"=>"WeatherFileDownloadURL"},
			{"db_field_name"=>"site_fuel_type", "xml_field_name"=>"SiteFuelType"},
			{"db_field_name"=>"hvac_auto_sizing", "xml_field_name"=>"HVACAutoSizing"},
			{"db_field_name"=>"simulate_design_days", "xml_field_name"=>"SimDsgnDays"},
			{"db_field_name"=>"run_period_begin_month", "xml_field_name"=>"RunPeriodBeginMonth"},
			{"db_field_name"=>"run_period_begin_day", "xml_field_name"=>"RunPeriodBeginDay"},
			{"db_field_name"=>"run_period_end_month", "xml_field_name"=>"RunPeriodEndMonth"},
			{"db_field_name"=>"run_period_end_day", "xml_field_name"=>"RunPeriodEndDay"},
			{"db_field_name"=>"run_period_year", "xml_field_name"=>"RunPeriodYear"},
			{"db_field_name"=>"exceptional_condition_complete_building", "xml_field_name"=>"ExcptCondCompleteBldg"},
			{"db_field_name"=>"exceptional_condition_exterior_lighting", "xml_field_name"=>"ExcptCondExtLtg"},
			{"db_field_name"=>"exceptional_condition_no_cooling_system", "xml_field_name"=>"ExcptCondNoClgSys"},
			{"db_field_name"=>"exceptional_condition_rated_capacity", "xml_field_name"=>"ExcptCondRtdCap"},
			{"db_field_name"=>"exceptional_condition_water_heater", "xml_field_name"=>"ExcptCondWtrHtr"},
			{"db_field_name"=>"exceptional_condition_narrative", "xml_field_name"=>"ExcptCondNarrative"},
			{"db_field_name"=>"disable_daylighting_controls", "xml_field_name"=>"DisableDayltgCtrls"},
			{"db_field_name"=>"default_daylighting_controls", "xml_field_name"=>"DefaultDayltgCtrls"},
			{"db_field_name"=>"simulation_variables_site", "xml_field_name"=>"SimVarsSite"},
			{"db_field_name"=>"simulation_variables_thermal_zone", "xml_field_name"=>"SimVarsThrmlZn"},
			{"db_field_name"=>"simulation_variables_daylighting", "xml_field_name"=>"SimVarsDayltg"},
			{"db_field_name"=>"simulation_variables_hvac_secondary", "xml_field_name"=>"SimVarsHVACSec"},
			{"db_field_name"=>"simulation_variables_hvac_primary", "xml_field_name"=>"SimVarsHVACPri"},
			{"db_field_name"=>"simulation_variables_hvac_zone", "xml_field_name"=>"SimVarsHVACZn"},
			{"db_field_name"=>"average_dry_bulb_temperature", "xml_field_name"=>"AvgDBTemp"},
			{"db_field_name"=>"monthly_average_temperature_maximum_difference", "xml_field_name"=>"MoAvgTempMaxDiff"},
			{"db_field_name"=>"holiday_reference", "xml_field_name"=>"HolRef"},
			{"db_field_name"=>"run_title", "xml_field_name"=>"RunTitle"},
			{"db_field_name"=>"analysis_type", "xml_field_name"=>"AnalysisType"},
			{"db_field_name"=>"compliance_type", "xml_field_name"=>"CompType"},
			{"db_field_name"=>"rule_report_type", "xml_field_name"=>"RuleReportType"},
			{"db_field_name"=>"rule_report_file_append", "xml_field_name"=>"RuleReportFileAppend"},
			{"db_field_name"=>"software_version", "xml_field_name"=>"SoftwareVersion"},
			{"db_field_name"=>"compliance_report_pdf", "xml_field_name"=>"CompReportPDF"},
			{"db_field_name"=>"compliance_report_xml", "xml_field_name"=>"CompReportXML"}
		]
	end

	def to_sdd_xml
		builder = Nokogiri::XML::Builder.new do |xml|
			xml.send(:Proj) do
				xml_fields.each do |field|
					xml.send(:"#{field['xml_field_name']}", self[field['db_field_name']])
				end
				# go through children if they have something to add, call their methods
				kids = self.children_models
				unless kids.nil? or kids.empty?
					kids.each do |k|
						if k == 'building'
							unless self.building.nil?
								self.building.to_sdd_xml(xml)
							end
						else
							models = self.send(k.pluralize)
							models.each do |m|
								m.to_sdd_xml(xml)
							end
						end
					end
				end
			end
		end
		builder.to_xml
	end
	def xml_save
		xml = self.to_sdd_xml
		File.open("#{Rails.root}/data/xmls/#{self.id}.xml", "w") do |f|
			f << xml
		end
	end

	def permit_scope_enums
		[
			'PermitNonresidentialAll',
			'PermitNonresidentialEnvelope',
			'PermitNonresidentialEnvelopeLighting',
			'PermitNonresidentialEnvelopeMechanical',
			'PermitNonresidentialLighting',
			'PermitNonresidentialLightingMechanical',
			'PermitNonresidentialMechanical'
		]
	end

	def climate_zone_county_enums
		[
			'Alameda',
			'Alpine',
			'Amador',
			'Butte',
			'Calaveras',
			'Colusa',
			'Contra Costa',
			'Del Norte',
			'El Dorado',
			'Fresno',
			'Glenn',
			'Humboldt',
			'Imperial',
			'Inyo',
			'Kern',
			'Kings',
			'Lake',
			'Lassen',
			'Los Angeles',
			'Madera',
			'Marin',
			'Mariposa',
			'Mendocino',
			'Merced',
			'Modoc',
			'Mono',
			'Monterey',
			'Napa',
			'Nevada',
			'Orange',
			'Placer',
			'Plumas',
			'Riverside',
			'Sacramento',
			'San Benito',
			'San Bernardino',
			'San Diego',
			'San Francisco',
			'San Joaquin',
			'San Luis Obispo',
			'San Mateo',
			'Santa Barbara',
			'Santa Clara',
			'Santa Cruz',
			'Shasta',
			'Sierra',
			'Siskiyou',
			'Solano',
			'Sonoma',
			'Stanislaus',
			'Sutter',
			'Tehama',
			'Trinity',
			'Tulare',
			'Tuolumne',
			'Ventura',
			'Yolo',
			'Yuba'
		]
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

	def site_fuel_type_enums
		[
			'- select -',
			'Electricity',
			'NaturalGas',
			'Propane'
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

	def analysis_type_enums
		[
			'Title24Compliance',
			'Title24ProposedOnly'
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

	def rule_report_type_enums
		[
			'ModelRpt_Space_InteriorLoadsElec',
			'ModelRpt_Space_InteriorLoadsFuel',
			'ModelRpt_HVACPrimary',
			'ModelRpt_Envelope',
			'ModelRpt_HVACSecondary',
			'ModelRpt_HVACSecondarySizing'
		]
	end

	def rule_report_file_append_enums
		[
			'- SpcLoadsElec.csv',
			'- SpcLoadsFuel.csv',
			'- HVACPrimary.csv',
			'- Envelope.csv',
			'- HVACSecondary.csv',
			'- HVACSecondarySizing.csv'
		]
	end
end
