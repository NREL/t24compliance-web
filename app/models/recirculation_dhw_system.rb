class RecirculationDhwSystem
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :type, type: String
  field :multiplier, type: Integer
  field :central_system, type: Integer
  field :distribution_type, type: String
  field :pump_power, type: Float
  field :pump_efficiency, type: Float
  field :system_story_count, type: Integer
  field :living_unit_count, type: Integer
  field :water_heater_count, type: Integer
  field :total_input_rating, type: Float
  field :total_tank_volume, type: Float
  field :baseline_recirculation_water_heater_reference, type: String
  field :use_default_loops, type: Integer
  field :pipe_length, type: Array
  field :pipe_diameter, type: Array
  field :pipe_location, type: Array
  field :loop_count, type: Integer
  field :pipe_extra_insulation, type: Integer
  field :annual_solar_fraction, type: Float

	has_many :recirculation_water_heaters


	def children_models
		children = [
			'recirculation_water_heater'
		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"status", "xml_field_name"=>"Status"},
			{"db_field_name"=>"type", "xml_field_name"=>"Type"},
			{"db_field_name"=>"multiplier", "xml_field_name"=>"Mult"},
			{"db_field_name"=>"central_system", "xml_field_name"=>"CentralSys"},
			{"db_field_name"=>"distribution_type", "xml_field_name"=>"DistType"},
			{"db_field_name"=>"pump_power", "xml_field_name"=>"PumpPwr"},
			{"db_field_name"=>"pump_efficiency", "xml_field_name"=>"PumpEff"},
			{"db_field_name"=>"system_story_count", "xml_field_name"=>"SysStoryCnt"},
			{"db_field_name"=>"living_unit_count", "xml_field_name"=>"LivingUnitCnt"},
			{"db_field_name"=>"water_heater_count", "xml_field_name"=>"WtrHtrCnt"},
			{"db_field_name"=>"total_input_rating", "xml_field_name"=>"TotInpRating"},
			{"db_field_name"=>"total_tank_volume", "xml_field_name"=>"TotTankVol"},
			{"db_field_name"=>"baseline_recirculation_water_heater_reference", "xml_field_name"=>"BaseRecircWtrHtrRef"},
			{"db_field_name"=>"use_default_loops", "xml_field_name"=>"UseDefaultLps"},
			{"db_field_name"=>"pipe_length", "xml_field_name"=>"PipeLen"},
			{"db_field_name"=>"pipe_diameter", "xml_field_name"=>"PipeDia"},
			{"db_field_name"=>"pipe_location", "xml_field_name"=>"PipeLctn"},
			{"db_field_name"=>"loop_count", "xml_field_name"=>"LpCnt"},
			{"db_field_name"=>"pipe_extra_insulation", "xml_field_name"=>"PipeExtraIns"},
			{"db_field_name"=>"annual_solar_fraction", "xml_field_name"=>"AnnualSolFrac"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:RecircDHWSys) do
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

	def type_enums
		[
			'- specify -'
		]
	end

	def distribution_type_enums
		[
			'- None -'
		]
	end
end