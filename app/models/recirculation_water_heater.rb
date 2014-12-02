class RecirculationWaterHeater
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :element_type, type: String
  field :tank_category, type: String
  field :tank_type, type: String
  field :input_rating, type: Integer
  field :energy_factor, type: Float
  field :tank_volume, type: Float
  field :tank_interior_insulation_r_value, type: Float
  field :tank_exterior_insulation_r_value, type: Float
  field :ambient_condition, type: String
  field :standby_loss_fraction, type: Float
  field :thermal_efficiency, type: Float

	belongs_to :recirculation_dhw_system


	def children_models
		children = [

		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"status", "xml_field_name"=>"Status"},
			{"db_field_name"=>"element_type", "xml_field_name"=>"ElementType"},
			{"db_field_name"=>"tank_category", "xml_field_name"=>"TankCat"},
			{"db_field_name"=>"tank_type", "xml_field_name"=>"TankType"},
			{"db_field_name"=>"input_rating", "xml_field_name"=>"InpRating"},
			{"db_field_name"=>"energy_factor", "xml_field_name"=>"EngyFac"},
			{"db_field_name"=>"tank_volume", "xml_field_name"=>"TankVol"},
			{"db_field_name"=>"tank_interior_insulation_r_value", "xml_field_name"=>"TankIntInsR"},
			{"db_field_name"=>"tank_exterior_insulation_r_value", "xml_field_name"=>"TankExtInsR"},
			{"db_field_name"=>"ambient_condition", "xml_field_name"=>"AmbCond"},
			{"db_field_name"=>"standby_loss_fraction", "xml_field_name"=>"StdbyLossFrac"},
			{"db_field_name"=>"thermal_efficiency", "xml_field_name"=>"ThrmlEff"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:RecircWtrHtr) do
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

	def element_type_enums
		[
			'Electric Resistance',
			'Natural Gas',
			'Propane',
			'Heat Pump',
			'Oil'
		]
	end

	def tank_category_enums
		[
			'Boiler',
			'Indirect',
			'Instantaneous',
			'Storage'
		]
	end

	def tank_type_enums
		[
			'Boiler',
			'Indirect',
			'Large Instantaneous',
			'Large Storage',
			'Large Tankless',
			'Small Instantaneous',
			'Small Storage',
			'Small Tankless'
		]
	end

	def ambient_condition_enums
		[
			'Unconditioned',
			'Conditioned'
		]
	end
end