class WaterHeater
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :type, type: String
  field :count, type: Integer
  field :fluid_segment_out_reference, type: String
  field :fluid_segment_makeup_reference, type: String
  field :storage_capacity, type: Float
  field :ef, type: Float
  field :recovery_efficiency, type: Float
  field :thermal_efficiency, type: Float
  field :hir_f_plr_curve_reference, type: String
  field :fuel_source, type: String
  field :off_cycle_fuel_source, type: String
  field :off_cycle_parasitic_losses, type: Float
  field :on_cycle_fuel_source, type: String
  field :on_cycle_parasitic_losses, type: Float
  field :tank_off_cycle_loss_coef, type: Float
  field :capacity_rated, type: Float
  field :minimum_capacity, type: Float
  field :standby_loss_fraction, type: Float
  field :electrical_ignition, type: Integer
  field :draft_fan_power, type: Float

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
			{"db_field_name"=>"count", "xml_field_name"=>"Cnt"},
			{"db_field_name"=>"fluid_segment_out_reference", "xml_field_name"=>"FluidSegOutRef"},
			{"db_field_name"=>"fluid_segment_makeup_reference", "xml_field_name"=>"FluidSegMakeupRef"},
			{"db_field_name"=>"storage_capacity", "xml_field_name"=>"StorCap"},
			{"db_field_name"=>"ef", "xml_field_name"=>"EF"},
			{"db_field_name"=>"recovery_efficiency", "xml_field_name"=>"RE"},
			{"db_field_name"=>"thermal_efficiency", "xml_field_name"=>"ThrmlEff"},
			{"db_field_name"=>"hir_f_plr_curve_reference", "xml_field_name"=>"HIR_fPLRCrvRef"},
			{"db_field_name"=>"fuel_source", "xml_field_name"=>"FuelSrc"},
			{"db_field_name"=>"off_cycle_fuel_source", "xml_field_name"=>"OffCycleFuelSrc"},
			{"db_field_name"=>"off_cycle_parasitic_losses", "xml_field_name"=>"OffCyclePrstcLoss"},
			{"db_field_name"=>"on_cycle_fuel_source", "xml_field_name"=>"OnCycleFuelSrc"},
			{"db_field_name"=>"on_cycle_parasitic_losses", "xml_field_name"=>"OnCyclePrstcLoss"},
			{"db_field_name"=>"tank_off_cycle_loss_coef", "xml_field_name"=>"TankOffCycleLossCoef"},
			{"db_field_name"=>"capacity_rated", "xml_field_name"=>"CapRtd"},
			{"db_field_name"=>"minimum_capacity", "xml_field_name"=>"MinCap"},
			{"db_field_name"=>"standby_loss_fraction", "xml_field_name"=>"StdbyLossFrac"},
			{"db_field_name"=>"electrical_ignition", "xml_field_name"=>"ElecIgnit"},
			{"db_field_name"=>"draft_fan_power", "xml_field_name"=>"DraftFanPwr"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:WtrHtr) do
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
			'- specify -',
			'Instantaneous',
			'Storage'
		]
	end

	def fuel_source_enums
		[
			'- specify -',
			'Electricity',
			'FuelOil#1',
			'NaturalGas',
			'PropaneGas'
		]
	end

	def off_cycle_fuel_source_enums
		[
			'- specify -',
			'Electricity',
			'FuelOil#1',
			'NaturalGas',
			'PropaneGas'
		]
	end

	def on_cycle_fuel_source_enums
		[
			'- specify -',
			'Electricity',
			'FuelOil#1',
			'NaturalGas',
			'PropaneGas'
		]
	end
end