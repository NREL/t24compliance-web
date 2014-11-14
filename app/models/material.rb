class Material
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :code_category, type: String
  field :framing_material, type: String

	belongs_to :project


	def children_models
		children = [

		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"code_category", "xml_field_name"=>"CodeCat"},
			{"db_field_name"=>"framing_material", "xml_field_name"=>"FrmMat"}
		]
	end

	def to_sdd_xml
		builder = Nokogiri::XML::Builder.new do |xml|
			xml.send(:Mat) do
				xml_fields.each do |field|
					xml.send(:"#{field['xml_field_name']}", self[field['db_field_name']])
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
end