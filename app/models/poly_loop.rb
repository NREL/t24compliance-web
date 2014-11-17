class PolyLoop
  include Mongoid::Document
	include Mongoid::Timestamps
	include Mongoid::Timestamps
  field :name, type: String

	belongs_to :space
	belongs_to :ceiling
	belongs_to :exterior_floor
	belongs_to :exterior_wall
	belongs_to :interior_floor
	belongs_to :interior_wall
	belongs_to :roof
	belongs_to :underground_floor
	belongs_to :underground_wall
	belongs_to :window
	belongs_to :skylight
	belongs_to :door
	belongs_to :external_shading_object
	has_many :cartesian_points


	def children_models
		children = [
			'cartesian_point'
		]

	def xml_fields
		xml_fields = [

		]

	def to_sdd_xml(xml)
		xml.send(:PolyLp) do
			xml_fields.each do |field|
				xml.send(:"#{field['xml_field_name']}", self[field['db_field_name']])
			# go through children if they have something to add, call their methods
			kids = self.children_models
			unless kids.nil? or kids.empty?
				kids.each do |k|
					models = self.send(k.pluralize)
					models.each do |m|
						m.to_sdd_xml(xml)

	belongs_to :space
	belongs_to :ceiling
	belongs_to :exterior_floor
	belongs_to :exterior_wall
	belongs_to :interior_floor
	belongs_to :interior_wall
	belongs_to :roof
	belongs_to :underground_floor
	belongs_to :underground_wall
	belongs_to :window
	belongs_to :skylight
	belongs_to :door
	belongs_to :external_shading_object
	has_many :cartesian_points


	def children_models
		children = [
			'cartesian_point'
		]
	end

	def xml_fields
		xml_fields = [

		]
	end

	def to_sdd_xml(xml)
		xml.send(:PolyLp) do
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