class ExteriorWall
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :construct_assembly_reference, type: String
  field :area, type: Float
  field :azimuth, type: Float

	belongs_to :space
	has_many :windows
	has_many :doors
	has_many :poly_loops


	def children_models
		children = [
			'window',
			'door',
			'poly_loop'
		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"status", "xml_field_name"=>"Status"},
			{"db_field_name"=>"construct_assembly_reference", "xml_field_name"=>"ConsAssmRef"},
			{"db_field_name"=>"area", "xml_field_name"=>"Area"},
			{"db_field_name"=>"azimuth", "xml_field_name"=>"Az"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:ExtWall) do
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
			'Existing',
			'Altered'
		]
	end
end