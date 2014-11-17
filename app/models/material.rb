class Material
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :code_category, type: String
  field :code_item, type: String
  field :framing_material, type: String
  field :framing_configuration, type: String
  field :framing_depth, type: String
  field :cavity_insulation, type: Float
  field :header_insulation, type: Float
  field :cmu_weight, type: String
  field :cmu_fill, type: String
  field :spandrel_panel_insulation, type: Float
  field :insulation_outside_waterproof_membrane, type: Integer

	belongs_to :project


	def children_models
		children = [

		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"code_category", "xml_field_name"=>"CodeCat"},
			{"db_field_name"=>"code_item", "xml_field_name"=>"CodeItem"},
			{"db_field_name"=>"framing_material", "xml_field_name"=>"FrmMat"},
			{"db_field_name"=>"framing_configuration", "xml_field_name"=>"FrmConfig"},
			{"db_field_name"=>"framing_depth", "xml_field_name"=>"FrmDepth"},
			{"db_field_name"=>"cavity_insulation", "xml_field_name"=>"CavityIns"},
			{"db_field_name"=>"header_insulation", "xml_field_name"=>"HeaderIns"},
			{"db_field_name"=>"cmu_weight", "xml_field_name"=>"CMUWt"},
			{"db_field_name"=>"cmu_fill", "xml_field_name"=>"CMUFill"},
			{"db_field_name"=>"spandrel_panel_insulation", "xml_field_name"=>"SpandrelPanelIns"},
			{"db_field_name"=>"insulation_outside_waterproof_membrane", "xml_field_name"=>"InsOutsdWtrprfMemb"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:Mat) do
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

	def code_category_enums
		[
			'- specify -',
			'Air',
			'Bldg Board and Siding',
			'Building Membrane',
			'Composite',
			'Concrete',
			'Concrete Sandwich Panel',
			'Finish Materials',
			'ICF Wall',
			'Insulation Batt',
			'Insulation Board',
			'Insulation Loose Fill',
			'Insulation Other',
			'Insulation Spray Applied',
			'Masonry Materials',
			'Masonry Units Hollow',
			'Masonry Units Solid',
			'Masonry Units with Fill',
			'Metal Insulated Panel Wall',
			'Plastering Materials',
			'Roofing',
			'SIPS Floor',
			'SIPS Roof',
			'SIPS Wall',
			'Spandrel Panels Curtain Walls',
			'Straw Bale Wall',
			'Woods'
		]
	end

	def framing_material_enums
		[
			'- specify -',
			'Wood',
			'Metal'
		]
	end

	def framing_configuration_enums
		[
			'- specify -',
			'Wall16inOC',
			'Wall24inOC',
			'WallAWS24inOC',
			'WallAWS48inOC',
			'Floor16inOC',
			'Floor24inOC',
			'Roof16inOC',
			'Roof24inOC',
			'Roof48inOC'
		]
	end

	def framing_depth_enums
		[
			'- specify -',
			'0_5In',
			'0_75In',
			'1In',
			'1_5In',
			'2In',
			'2_5In',
			'3In',
			'3_5In',
			'4In',
			'4_5In',
			'5In',
			'5_5In',
			'7_25In',
			'9_25In',
			'11_25In'
		]
	end

	def cmu_weight_enums
		[
			'- specify -',
			'LightWeight',
			'MediumWeight',
			'NormalWeight',
			'ClayUnit'
		]
	end

	def cmu_fill_enums
		[
			'- specify -',
			'Solid',
			'Empty',
			'Insulated'
		]
	end
end