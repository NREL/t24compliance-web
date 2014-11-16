class BuildingStory
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :multiplier, type: Integer
  field :z, type: Float
  field :floor_to_floor_height, type: Float
  field :floor_to_ceiling_height, type: Float

	belongs_to :building
	has_many :spaces


	def children_models
		children = [
			'space'
		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"multiplier", "xml_field_name"=>"Mult"},
			{"db_field_name"=>"z", "xml_field_name"=>"Z"},
			{"db_field_name"=>"floor_to_floor_height", "xml_field_name"=>"FlrToFlrHgt"},
			{"db_field_name"=>"floor_to_ceiling_height", "xml_field_name"=>"FlrToCeilingHgt"}
		]
	end

	def to_sdd_xml
		builder = Nokogiri::XML::Builder.new do |xml|
			xml.send(:Story) do
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
end