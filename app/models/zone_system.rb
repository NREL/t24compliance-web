class ZoneSystem
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :type, type: String
  field :description, type: String
  field :hvac_auto_sizing, type: Integer
  field :fan_control, type: String
  field :cooling_control, type: String
  field :count, type: Integer
  field :cooling_design_supply_air_temperature, type: Float
  field :heating_design_supply_air_temperature, type: Float
  field :exhaust_system_type, type: String
  field :exhaust_operation_mode, type: String
  field :exhaust_control_method, type: String
  field :air_distribution_type, type: String

	belongs_to :building
	has_many :coil_coolings
	has_many :coil_heatings
	has_many :fans


	def children_models
		children = [
			'coil_cooling',
			'coil_heating',
			'fan'
		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"status", "xml_field_name"=>"Status"},
			{"db_field_name"=>"type", "xml_field_name"=>"Type"},
			{"db_field_name"=>"description", "xml_field_name"=>"Desc"},
			{"db_field_name"=>"hvac_auto_sizing", "xml_field_name"=>"HVACAutoSizing"},
			{"db_field_name"=>"fan_control", "xml_field_name"=>"FanCtrl"},
			{"db_field_name"=>"cooling_control", "xml_field_name"=>"ClgCtrl"},
			{"db_field_name"=>"count", "xml_field_name"=>"Cnt"},
			{"db_field_name"=>"cooling_design_supply_air_temperature", "xml_field_name"=>"ClgDsgnSupAirTemp"},
			{"db_field_name"=>"heating_design_supply_air_temperature", "xml_field_name"=>"HtgDsgnSupAirTemp"},
			{"db_field_name"=>"exhaust_system_type", "xml_field_name"=>"ExhSysType"},
			{"db_field_name"=>"exhaust_operation_mode", "xml_field_name"=>"ExhOperMode"},
			{"db_field_name"=>"exhaust_control_method", "xml_field_name"=>"ExhCtrlMthd"},
			{"db_field_name"=>"air_distribution_type", "xml_field_name"=>"AirDistType"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:ZnSys) do
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
			'- specify -',
			'PTAC',
			'PTHP',
			'FPFC',
			'Baseboard',
			'WSHP',
			'Exhaust'
		]
	end

	def fan_control_enums
		[
			'Continuous',
			'Cycling'
		]
	end

	def cooling_control_enums
		[
			'NoSATControl'
		]
	end

	def exhaust_system_type_enums
		[
			'General',
			'Laboratory',
			'CommercialKitchen',
			'ParkingGarage'
		]
	end

	def exhaust_operation_mode_enums
		[
			'DecoupledFromSystem',
			'CoupledToSystem'
		]
	end

	def exhaust_control_method_enums
		[
			'ConstantFlowConstantSpeedFan',
			'VariableFlowConstantSpeedFan',
			'VariableFlowVariableSpeedFan',
			'NoCOControl',
			'COControl'
		]
	end

	def air_distribution_type_enums
		[
			'Mixing',
			'None'
		]
	end
end