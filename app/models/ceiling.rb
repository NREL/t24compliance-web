class Ceiling
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :area, type: Float
  field :adjacent_space_reference, type: Objectref
  field :construct_assembly_reference, type: Objectref

	belongs_to :space
	has_many :poly_loops


	def children_models
		children = [
			'poly_loop'
		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"area", "xml_field_name"=>"Area"},
			{"db_field_name"=>"adjacent_space_reference", "xml_field_name"=>"AdjacentSpcRef"},
			{"db_field_name"=>"construct_assembly_reference", "xml_field_name"=>"ConsAssmRef"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:Ceiling) do
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
end