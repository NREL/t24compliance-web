class HeatRejection
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :type, type: String
  field :fan_type, type: String
  field :modulation_control, type: String
  field :fluid_segment_in_reference, type: String
  field :fluid_segment_out_reference, type: String
  field :entering_temperature_design, type: Float
  field :design_wb_temperature, type: Float
  field :leaving_temperature_design, type: Float
  field :cell_count, type: Float
  field :capacity_rated, type: Float
  field :total_fan_hp, type: Float
  field :air_flow_capacity, type: Float
  field :water_flow_capacity, type: Float
  field :power_f_plr_curve_reference, type: String
  field :low_speed_air_flow_ratio, type: Float
  field :low_speed_power_ratio, type: Float
  field :minimum_speed_ratio, type: Float

	belongs_to :fluid_system
	has_many :pumps


	def children_models
		children = [
			'pump'
		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"status", "xml_field_name"=>"Status"},
			{"db_field_name"=>"type", "xml_field_name"=>"Type"},
			{"db_field_name"=>"fan_type", "xml_field_name"=>"FanType"},
			{"db_field_name"=>"modulation_control", "xml_field_name"=>"ModCtrl"},
			{"db_field_name"=>"fluid_segment_in_reference", "xml_field_name"=>"FluidSegInRef"},
			{"db_field_name"=>"fluid_segment_out_reference", "xml_field_name"=>"FluidSegOutRef"},
			{"db_field_name"=>"entering_temperature_design", "xml_field_name"=>"EntTempDsgn"},
			{"db_field_name"=>"design_wb_temperature", "xml_field_name"=>"DsgnWBTemp"},
			{"db_field_name"=>"leaving_temperature_design", "xml_field_name"=>"LvgTempDsgn"},
			{"db_field_name"=>"cell_count", "xml_field_name"=>"CellCnt"},
			{"db_field_name"=>"capacity_rated", "xml_field_name"=>"CapRtd"},
			{"db_field_name"=>"total_fan_hp", "xml_field_name"=>"TotFanHP"},
			{"db_field_name"=>"air_flow_capacity", "xml_field_name"=>"AirFlowCap"},
			{"db_field_name"=>"water_flow_capacity", "xml_field_name"=>"WtrFlowCap"},
			{"db_field_name"=>"power_f_plr_curve_reference", "xml_field_name"=>"Pwr_fPLRCrvRef"},
			{"db_field_name"=>"low_speed_air_flow_ratio", "xml_field_name"=>"LowSpdAirFlowRat"},
			{"db_field_name"=>"low_speed_power_ratio", "xml_field_name"=>"LowSpdPwrRat"},
			{"db_field_name"=>"minimum_speed_ratio", "xml_field_name"=>"MinSpdRat"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:HtRej) do
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
			'Existing'
		]
	end

	def type_enums
		[
			'OpenTower',
			'ClosedTower',
			'GroundSourceHeatExchanger',
			'Lake',
			'Well'
		]
	end

	def fan_type_enums
		[
			'Axial',
			'Centrifugal'
		]
	end

	def modulation_control_enums
		[
			'Bypass',
			'Cycling',
			'TwoSpeed',
			'VariableSpeedDrive'
		]
	end
end