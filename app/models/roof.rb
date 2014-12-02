class Roof
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :construct_assembly_reference, type: String
  field :area, type: Float
  field :azimuth, type: Float
  field :tilt, type: Float
  field :interior_solar_absorptance, type: Float
  field :interior_thermal_absorptance, type: Float
  field :interior_visible_absorptance, type: Float
  field :field_applied_coating, type: Integer
  field :crrc_initial_reflectance, type: Float
  field :crrc_aged_reflectance, type: Float
  field :crrc_initial_emittance, type: Float
  field :crrc_aged_emittance, type: Float
  field :crrc_initial_sri, type: Integer
  field :crrc_aged_sri, type: Integer
  field :crrc_product_id, type: String

	belongs_to :space
	has_many :skylights
	has_many :poly_loops


	def children_models
		children = [
			'skylight',
			'poly_loop'
		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"status", "xml_field_name"=>"Status"},
			{"db_field_name"=>"construct_assembly_reference", "xml_field_name"=>"ConsAssmRef"},
			{"db_field_name"=>"area", "xml_field_name"=>"Area"},
			{"db_field_name"=>"azimuth", "xml_field_name"=>"Az"},
			{"db_field_name"=>"tilt", "xml_field_name"=>"Tilt"},
			{"db_field_name"=>"interior_solar_absorptance", "xml_field_name"=>"IntSolAbs"},
			{"db_field_name"=>"interior_thermal_absorptance", "xml_field_name"=>"IntThrmlAbs"},
			{"db_field_name"=>"interior_visible_absorptance", "xml_field_name"=>"IntVisAbs"},
			{"db_field_name"=>"field_applied_coating", "xml_field_name"=>"FieldAppliedCoating"},
			{"db_field_name"=>"crrc_initial_reflectance", "xml_field_name"=>"CRRCInitialRefl"},
			{"db_field_name"=>"crrc_aged_reflectance", "xml_field_name"=>"CRRCAgedRefl"},
			{"db_field_name"=>"crrc_initial_emittance", "xml_field_name"=>"CRRCInitialEmittance"},
			{"db_field_name"=>"crrc_aged_emittance", "xml_field_name"=>"CRRCAgedEmittance"},
			{"db_field_name"=>"crrc_initial_sri", "xml_field_name"=>"CRRCInitialSRI"},
			{"db_field_name"=>"crrc_aged_sri", "xml_field_name"=>"CRRCAgedSRI"},
			{"db_field_name"=>"crrc_product_id", "xml_field_name"=>"CRRCProdID"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:Roof) do
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