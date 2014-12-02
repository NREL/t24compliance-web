class Boiler
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :type, type: String
  field :fuel_source, type: String
  field :draft_type, type: String
  field :fluid_segment_in_reference, type: String
  field :fluid_segment_out_reference, type: String
  field :has_bypass, type: Integer
  field :entering_temperature_design, type: Float
  field :leaving_temperature_design, type: Float
  field :capacity_rated, type: Float
  field :afue, type: Float
  field :combustion_efficiency, type: Float
  field :thermal_efficiency, type: Float
  field :hir_f_plr_curve_reference, type: String
  field :eir, type: Float
  field :fuel_full_load, type: Float
  field :heat_loss, type: Float
  field :unload_ratio_minimum, type: Float
  field :draft_fan_horse_power, type: Float
  field :parasitic_load, type: Float
  field :water_flow_capacity, type: Float

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
			{"db_field_name"=>"fuel_source", "xml_field_name"=>"FuelSrc"},
			{"db_field_name"=>"draft_type", "xml_field_name"=>"DraftType"},
			{"db_field_name"=>"fluid_segment_in_reference", "xml_field_name"=>"FluidSegInRef"},
			{"db_field_name"=>"fluid_segment_out_reference", "xml_field_name"=>"FluidSegOutRef"},
			{"db_field_name"=>"has_bypass", "xml_field_name"=>"HasBypass"},
			{"db_field_name"=>"entering_temperature_design", "xml_field_name"=>"EntTempDsgn"},
			{"db_field_name"=>"leaving_temperature_design", "xml_field_name"=>"LvgTempDsgn"},
			{"db_field_name"=>"capacity_rated", "xml_field_name"=>"CapRtd"},
			{"db_field_name"=>"afue", "xml_field_name"=>"AFUE"},
			{"db_field_name"=>"combustion_efficiency", "xml_field_name"=>"CombEff"},
			{"db_field_name"=>"thermal_efficiency", "xml_field_name"=>"ThrmlEff"},
			{"db_field_name"=>"hir_f_plr_curve_reference", "xml_field_name"=>"HIR_fPLRCrvRef"},
			{"db_field_name"=>"eir", "xml_field_name"=>"EIR"},
			{"db_field_name"=>"fuel_full_load", "xml_field_name"=>"FuelFullLd"},
			{"db_field_name"=>"heat_loss", "xml_field_name"=>"HtLoss"},
			{"db_field_name"=>"unload_ratio_minimum", "xml_field_name"=>"UnldRatMin"},
			{"db_field_name"=>"draft_fan_horse_power", "xml_field_name"=>"DraftFanHp"},
			{"db_field_name"=>"parasitic_load", "xml_field_name"=>"ParasiticLd"},
			{"db_field_name"=>"water_flow_capacity", "xml_field_name"=>"WtrFlowCap"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:Blr) do
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
			'HotWater',
			'Steam'
		]
	end

	def fuel_source_enums
		[
			'Gas',
			'Oil',
			'Electric'
		]
	end

	def draft_type_enums
		[
			'MechanicalNoncondensing',
			'Condensing',
			'Natural'
		]
	end
end