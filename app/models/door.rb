class Door
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :operation, type: String
  field :door_construction_reference, type: String
  field :area, type: Float

	belongs_to :exterior_wall
	belongs_to :interior_wall
	has_many :poly_loops


	def children_models
		children = [
			'poly_loop'
		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"status", "xml_field_name"=>"Status"},
			{"db_field_name"=>"operation", "xml_field_name"=>"Oper"},
			{"db_field_name"=>"door_construction_reference", "xml_field_name"=>"DrConsRef"},
			{"db_field_name"=>"area", "xml_field_name"=>"Area"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:Dr) do
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

	def operation_enums
		[
			'- specify -',
			'NonSwinging',
			'Swinging'
		]
	end
end