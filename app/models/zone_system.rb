class ZoneSystem
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :status, type: String
  field :type, type: String

	belongs_to :building
	has_many :coil_coolings
	has_many :coil_heatings
	has_many :fans


	def children_models
		children = [
			'coil_cooling',
			'coil_heating',
			'fan'
		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"status", "xml_field_name"=>"Status"},
			{"db_field_name"=>"type", "xml_field_name"=>"Type"}
		]
	end

	def to_sdd_xml
		builder = Nokogiri::XML::Builder.new do |xml|
			xml.send(:ZnSys) do
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
			'Existing',
			'Altered'
		]
	end

	def type_enums
		[
			'- specify -',
			'PTAC',
			'PTHP',
			'FPFC',
			'Baseboard',
			'WSHP',
			'Exhaust'
		]
	end
end