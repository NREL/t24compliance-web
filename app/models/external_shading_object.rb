class ExternalShadingObject
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :transmittance_schedule_reference, type: String
  field :solar_reflectance, type: Float
  field :visible_reflectance, type: Float

	has_many :poly_loops
	belongs_to :project


	def children_models
		children = [
			'poly_loop'
		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"status", "xml_field_name"=>"Status"},
			{"db_field_name"=>"transmittance_schedule_reference", "xml_field_name"=>"TransSchRef"},
			{"db_field_name"=>"solar_reflectance", "xml_field_name"=>"SolRefl"},
			{"db_field_name"=>"visible_reflectance", "xml_field_name"=>"VisRefl"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:ExtShdgObj) do
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
end