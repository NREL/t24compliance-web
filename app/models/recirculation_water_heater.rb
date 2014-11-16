class RecirculationWaterHeater
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :element_type, type: String
  field :tank_category, type: String

	belongs_to :recirculation_dhw_system


	def children_models
		children = [

		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"status", "xml_field_name"=>"Status"},
			{"db_field_name"=>"element_type", "xml_field_name"=>"ElementType"},
			{"db_field_name"=>"tank_category", "xml_field_name"=>"TankCat"}
		]
	end

	def to_sdd_xml
		builder = Nokogiri::XML::Builder.new do |xml|
			xml.send(:RecircWtrHtr) do
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
end