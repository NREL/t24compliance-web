class InteriorWall
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String

	belongs_to :space
	has_many :doors
	has_many :poly_loops


	def children_models
		children = [
			'door',
			'poly_loop'
		]
	end

	def xml_fields
		xml_fields = [

		]
	end

	def to_sdd_xml
		builder = Nokogiri::XML::Builder.new do |xml|
			xml.send(:IntWall) do
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