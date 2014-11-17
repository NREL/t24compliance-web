class AirSystem
  include Mongoid::Document
	include Mongoid::Timestamps
	include Mongoid::Timestamps
  field :name, type: String

	belongs_to :building
	has_many :air_segments
	has_many :terminal_units
	has_many :outside_air_controls


	def children_models
		children = [
			'air_segment'
			'terminal_unit'
			'outside_air_control'
		]

	def xml_fields
		xml_fields = [

		]

	def to_sdd_xml(xml)
		xml.send(:AirSys) do
			xml_fields.each do |field|
				xml.send(:"#{field['xml_field_name']}", self[field['db_field_name']])
			# go through children if they have something to add, call their methods
			kids = self.children_models
			unless kids.nil? or kids.empty?
				kids.each do |k|
					models = self.send(k.pluralize)
					models.each do |m|
						m.to_sdd_xml(xml)

	belongs_to :building
	has_many :air_segments
	has_many :terminal_units
	has_many :outside_air_controls


	def children_models
		children = [
			'air_segment',
			'terminal_unit',
			'outside_air_control'
		]
	end

	def xml_fields
		xml_fields = [

		]
	end

	def to_sdd_xml(xml)
		xml.send(:AirSys) do
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