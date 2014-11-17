class OutsideAirControl
  include Mongoid::Document
	include Mongoid::Timestamps
  field :name, type: String
  field :economizer_control_method, type: String
  field :economizer_integration, type: String

	belongs_to :air_system


	def children_models
		children = [

		]
	end

	def xml_fields
		xml_fields = [
			{"db_field_name"=>"economizer_control_method", "xml_field_name"=>"EconoCtrlMthd"},
			{"db_field_name"=>"economizer_integration", "xml_field_name"=>"EconoIntegration"}
		]
	end

	def to_sdd_xml(xml)
		xml.send(:OACtrl) do
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

	def economizer_control_method_enums
		[
			'NoEconomizer',
			'FixedDryBulb',
			'DifferentialDryBulb',
			'DifferentialEnthalpy',
			'DifferentialDryBulbAndEnthalpy'
		]
	end

	def economizer_integration_enums
		[
			'NonIntegrated',
			'Integrated'
		]
	end
end