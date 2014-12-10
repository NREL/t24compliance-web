namespace :code_gen do
  desc "test code generation"
  task :test_run => :environment do
    `rails g scaffold ExampleModel --no-helper --no-assets --no-test-framework`
  end

  desc "generate scaffold from inputs"
  task :generate_scaffolds => :environment do
    scaffolds = inputs_to_scaffold

    # for each scaffold do:
    scaffolds.each do |s|
      input = Input.find_by(name: s)
      fields_str = ''
      # make Controller name
      controller_name = input.display_name

      # always add a 'name:string' field
      fields_str = 'name:string'
      num = 0
      # get fields (in a string name: type)
      input.data_fields.each do |df|

        # only create fields not marked as 'remove'
        unless df['remove']
          num += 1
          if df['data_type'].include? 'Array'
            data_type = 'array'
          elsif df['data_type'].include? 'Enumeration'
            data_type = 'string'
          else
            data_type = df['data_type'].downcase
          end

          fields_str = fields_str + ", #{df[:db_field_name]}:#{data_type}"
        end
      end

      puts "Generating scaffold for #{controller_name} with #{num} fields"

      # call generate scaffold  (use -f to force/overwrite)
      #output = `rails g scaffold #{controller_name} #{fields_str} --force --no-helper --no-assets --no-test-framework`

      # only generate models now
      output = `rails g model #{controller_name.singularize} #{fields_str} --force --no-helper --no-assets --no-test-framework`

      puts "Output of generate command: #{output}"
      puts '***************'
    end
  end

  desc "add enums, timestamps, and relationships to model.rb"
  task :add_model_extras => :environment do
    scaffolds = inputs_to_scaffold
    scaffolds.each do |s|
      input = Input.find_by(name: s)

      # rewrite model file
      singularized_filename = input.display_name.singularize.underscore

      # catch unique cases where it is okay
      #unless input.display_name == 'space_function_defaults'
      #  singularized_filename = singularized_filename.singularize.underscore
      #end

      File.open("#{Rails.root}/app/models/#{singularized_filename}-tmp.rb", 'w') do |out| # 'w' for a new file, 'a' append to existing
        File.open("#{Rails.root}/app/models/#{singularized_filename}.rb", 'r') do |f|
          f.each_line do |line|
            unless line.strip == 'end'
              # don't print the last comma
              line = line.gsub(/,$/, '')
              # special case: change ObjectRef to String. Will have to know how to handle those in the future (all end with _reference)
              line = line.gsub('Objectref', 'String')
              out.write(line)
              # add mongoid timestamps
              if line.include? 'Mongoid::Document'
                out.write(mongoid_timestamps)
              end
            end
          end
        end

        # add relationships
        out.write(generate_relationships(input))

        # add indexes
        out.write(generate_indexes(input))

        # add call back definitions
        out.write(generate_call_back_defs(input))

        # add children
        out.write(generate_children(input))

        # add xml fields
        out.write(generate_xml_fields_list(input))

        # add sdd_xml
        out.write(generate_sdd_xml(input))

        # add xml_save on Project model only
        out.write(generate_xml_save(input))

        # add in the from xml method
        out.write(generate_from_sdd_xml(input))

        # sdd json
        out.write(generate_from_sdd_json(input))
        out.write(generate_from_sdd_json_helpers(input))

        out.write(generate_call_backs(input))


        # write enums
        enums = generate_enumerations(input)
        enums.each do |e|
          out.write(e)
        end

        # write final end
        out.write('end')
      end

      # replace files
      `rm #{Rails.root}/app/models/#{singularized_filename}.rb`
      `mv #{Rails.root}/app/models/#{singularized_filename}-tmp.rb #{Rails.root}/app/models/#{singularized_filename}.rb`
    end
  end

  desc "save a test project"
  task :test => :environment do
    f = File.join(Rails.root, "spec/files/cbecc_com_instances/0200016-OffSml-SG-BaseRun.xml")
    p = Project.from_sdd_xml(f)
    puts p.to_sdd_xml
  end

  desc "run scaffold and model extras"
  task :generate => [:generate_scaffolds, :add_model_extras]

  # HELPER METHODS

  # list of inputs to scaffold. Select one of the other.
  def inputs_to_scaffold
    # ['Proj', 'Bldg', 'Story', 'Spc']
    Input.all.map { |i| i.name }
  end

  def mongoid_timestamps
    "#{' '*2}include Mongoid::Timestamps\n\n"
  end

  # used by generate_xml_fields_list and generate_sdd_xml
  def xml_fields(input)
    xml_fields = []
    xml_fields << {db_field_name: 'name', xml_field_name: 'Name'}

    input.data_fields.each do |df|
      f_hash = {}
      unless df['remove']
        f_hash[:db_field_name] = df[:db_field_name]
        f_hash[:xml_field_name] = df[:name]
        xml_fields << f_hash
      end
    end
    xml_fields
  end

  def children(input)
    kids = []
    unless input.children.nil?
      input.children.each do |c|
        k_hash = {}
        model = Input.find_by(name: c)
        k_hash['xml_name'] = model.name
        k_hash['model_name'] = model.display_name.singularize.underscore
        kids << k_hash
      end
    end
    kids
  end

  def generate_xml_fields_list(input)
    xml_str = "\n#{' '*2}def self.xml_fields\n"
    xml_str = xml_str + "#{' '*4}xml_fields = [\n"

    xml_fields = xml_fields(input)
    unless xml_fields.nil? || xml_fields.empty?
      xml_str = xml_str + "#{' '*6}" + xml_fields.join(",\n#{' '*6}")
    end
    xml_str = xml_str + "\n#{' '*4}]\n"
    xml_str = xml_str + "#{' '*2}end\n\n"
  end

  def generate_children(input)
    kids_str = "\n#{' '*2}def self.children_models\n"
    kids_str = kids_str + "#{' '*4}children = [\n"
    kids = children(input)
    unless kids.nil? || kids.empty?
      kids.each do |k|
        kids_str = kids_str + "#{' '*6} { model_name: '#{k['model_name']}', xml_name: '#{k['xml_name']}' },\n"
      end
      kids_str = kids_str.chop.chop
    end
    kids_str = kids_str + "\n#{' '*4}]\n#{' '*2}end\n"
  end

  def generate_sdd_xml(input)
    if input.name == 'Proj'
      %q{
  # This method is autogenerated. Do not change directly.
  def to_sdd_xml
    builder = Nokogiri::XML::Builder.new do |xml|
      xml.send(:Proj) do
        self.class.xml_fields.each do |field|
          xml.send(:"#{field[:xml_field_name]}", self[field[:db_field_name]]) if self[field[:db_field_name]]
        end
        # go through children if they have something to add, call their methods
        kids = self.class.children_models
        unless kids.nil? || kids.empty?
          kids.each do |k|
            if k[:model_name] == 'building'
              unless self.building.nil?
                self.building.to_sdd_xml(k, xml)
              end
            else
              models = self.send(k[:model_name].pluralize)
              models.each do |m|
                m.to_sdd_xml(k, xml)
              end
            end
          end
        end
      end
    end
    builder.to_xml
  end
      }
    else
      %q{
  # This method is autogenerated. Do not change directly.
  def to_sdd_xml(meta, xml)
    xml.send(meta[:xml_name]) do
      self.class.xml_fields.each do |field|
        if self[field[:db_field_name]]
          if self[field[:db_field_name]].is_a? Array
            logger.debug "Translating to XML and the object is an Array"
            self[field[:db_field_name]].each_with_index do |instance, index|
              xml.send(:"#{field[:xml_field_name]}", instance, "index" => index)
            end
          else
            xml.send(:"#{field[:xml_field_name]}", self[field[:db_field_name]])
          end
        end
      end

      # go through children if they have something to add, call their methods
      kids = self.class.children_models
      unless kids.nil? || kids.empty?
        kids.each do |k|
          models = self.send(k[:model_name].pluralize)
          models.each do |m|
            m.to_sdd_xml(k, xml)
          end
        end
      end
    end
  end
      }
    end
  end

  def generate_xml_save(input)
    if input.name == 'Proj'
      %q{
  # This method is autogenerated. Do not change directly.
  def xml_save(filename)
    logger.warn "Overwriting XML file '#{filename}'" if File.exist? filename

    xml = self.to_sdd_xml
    File.open(filename, "w") { |f| f << self.to_sdd_xml }
  end
    }
    end
  end

  def generate_from_sdd_xml(input)
    if input.name == 'Proj'
      %q{
  # This method is autogenerated. Do not change directly.
  # Top level method takes the XML as a Hash and parses it recursively
  def self.from_sdd_xml(filename)
    p = nil
    if File.exist? filename
      file = File.read(filename)
      h = Hash.from_xml(file)

      # For the main project, there is no meta, so create it manually.
      # This allows us to use the same method for all the classes.
      meta = { model_name: 'project', xml_name: 'Proj' }
      if h && h['SDDXML'] && h['SDDXML']['Proj']
        p = Project.create_from_sdd_json(meta, h['SDDXML']['Proj'])
        if p
          p.create_children_from_sdd_json(meta, h['SDDXML']['Proj'])
          p.save!
          # reload for the relationships
          p.reload
        end
      else
        fail "Could not find the root element of the XML file"
      end
    else
      fail "Could not find SDD XML file #{filename}"
    end

    p
  end
}
    end
  end

  def generate_from_sdd_json(input)
    if input.name == 'Proj'
      # skip for Proj
    else
      %q{
  # This method is autogenerated. Do not change directly.
  # Take the map of model name and xml name, and the hash (from the XML).
  def self.from_sdd_json(meta, h)
    o = nil
    if meta && h
      self_model = meta[:model_name].camelcase(:upper).constantize
      o = self_model.create_from_sdd_json(meta, h)
      if o
        o.create_children_from_sdd_json(meta, h)
        o.save!
        o.reload # in case of relationships being updated
      else
        fail "Could not create instance of #{self_model} for #{meta[:model_name]}"
      end
    end

    o
  end
  }
    end
  end

  def generate_from_sdd_json_helpers(input)
    %q{
  # This method is autogenerated. Do not change directly.
  def self.create_from_sdd_json(meta, h)
    new_h = {}

    # Find fields as defined by the XML
    self_model = meta[:model_name].camelcase(:upper).constantize
    self_model.xml_fields.each do |field|
      if h[field[:xml_field_name]]
        logger.debug "Field Data Type: #{self_model.fields[field[:db_field_name]].options[:type]}"
        if self_model.fields[field[:db_field_name]].options[:type].to_s == 'Array'
          logger.debug "Data model has an array as the field"
          # check if the hash has an array, otherwise make it an array
          if h[field[:xml_field_name]].is_a? Array
            logger.debug "XML/JSON field is already an Array"
            new_h[field[:db_field_name]] = h[field[:xml_field_name]]
          else
            new_h[field[:db_field_name]] = [h[field[:xml_field_name]]]
          end
        else
          new_h[field[:db_field_name]] = h[field[:xml_field_name]]
        end

      end
    end

    # new_h can be empty if the xml has no fields, but still create the object
    o = self_model.new(new_h)

    o
  end

  # This method is autogenerated. Do not change directly.
  def create_children_from_sdd_json(meta, h)
    # Go through the children
    self_model = meta[:model_name].camelcase(:upper).constantize
    kids = self_model.children_models
    unless kids.nil? || kids.empty?
      kids.each do |k|
        # check if the kids have a json object at this level
        if h[k[:xml_name]]
          logger.debug "XML child is #{k[:xml_name]}"
          logger.debug "Model name is #{k[:model_name]}"
          if h[k[:xml_name]].is_a? Array
            logger.debug "#{k[:xml_name]} is an array, will add all the objects"
            h[k[:xml_name]].each do |h_instance|
              klass = k[:model_name].camelcase(:upper).constantize
              if klass.respond_to? :from_sdd_json
                model = klass.from_sdd_json(k, h_instance)

                # Assign the foreign key on the object
                model["#{meta[:model_name]}_id"] = self.id
                model.save!
              else
                logger.warn "Class #{klass} does not have instance method 'from_sdd_json'"
              end
            end
          elsif h[k[:xml_name]].is_a? Hash
            logger.debug "#{k[:xml_name]} is a single object, will add only one"
            klass = k[:model_name].camelcase(:upper).constantize
            if klass.respond_to? :from_sdd_json
              model = klass.from_sdd_json(k, h[k[:xml_name]])

              # Assign the foreign key on the object
              model["#{meta[:model_name]}_id"] = self.id
              model.save!
            else
              logger.warn "Class #{klass} does not have instance method 'from_sdd_json'"
            end
          end
        end
      end
    end
  end
  }
  end

  def generate_call_backs(input)
    if input.name == 'Proj'
      %{
  protected

  def build_model
    # always make the simulation model
    logger.info "creating dependent models"
    self.simulation = Simulation.new
    self.simulation.save!

    true
  end
      }
    end
  end

  def generate_relationships(input)
    relations_str = "\n"

    unless input.parents.nil?
      input.parents.each do |p|
        model = Input.find_by(name: p)
        relations_str = relations_str + "  belongs_to :#{model.display_name.singularize.underscore}\n"
      end
    end

    unless input.children.nil?
      input.children.each do |c|
        model = Input.find_by(name: c)
        if c == 'Bldg'
          relations_str = "#{relations_str}  has_one :#{model.display_name.singularize.underscore}, dependent: :destroy\n"
        else
          relations_str = "#{relations_str}  has_many :#{model.display_name.underscore.pluralize}, dependent: :destroy\n"
        end
      end
    end

    # check for missing relationships (some belongs_to are missing on the children models)
    relationships = add_missing_relationships
    relationships.each do |r|
      if r['name'] == input.display_name.singularize.underscore
        relations_str = relations_str + "  " + r['relation'] + "\n"
      end
    end

    relations_str = relations_str + "\n"
  end

  def generate_indexes(input)
    # unless input.children.nil?
    #   input.children.each do |c|
    #     model = Input.find_by(name: c)
    #     if c == 'Bldg'
    #       relations_str = "#{relations_str}  has_one :#{model.display_name.singularize.underscore}, dependent: :destroy\n"
    #     else
    #       relations_str = "#{relations_str}  has_many :#{model.display_name.underscore.pluralize}, dependent: :destroy\n"
    #     end
    #   end
    # end
  end

  def generate_call_back_defs(input)
    if input.name == 'Proj'
      %{
  # callbacks
  before_create :build_model
      }
    end
  end

  def add_missing_relationships
    # model to apply to => relationship to add
    [
        {'name' => 'building', 'relation' => "belongs_to :project"},
        {'name' => 'schedule_day', 'relation' => "belongs_to :project"},
        {'name' => 'schedule_week', 'relation' => "belongs_to :project"},
        {'name' => 'schedule', 'relation' => "belongs_to :project"},
        {'name' => 'construct_assembly', 'relation' => "belongs_to :project"},
        {'name' => 'material', 'relation' => "belongs_to :project"},
        {'name' => 'fenestration_construction', 'relation' => "belongs_to :project"},
        {'name' => 'door_construction', 'relation' => "belongs_to :project"},
        {'name' => 'space_function_default', 'relation' => "belongs_to :project"},
        {'name' => 'luminaire', 'relation' => "belongs_to :project"},
        {'name' => 'curve_linear', 'relation' => "belongs_to :project"},
        {'name' => 'curve_quadratic', 'relation' => "belongs_to :project"},
        {'name' => 'curve_cubic', 'relation' => "belongs_to :project"},
        {'name' => 'curve_double_quadratic', 'relation' => "belongs_to :project"},
        {'name' => 'external_shading_object', 'relation' => "belongs_to :project"},
        {'name' => 'project', 'relation' => "has_one :simulation, dependent: :destroy"},
        {'name' => 'project', 'relation' => "belongs_to :user"}
    ]
  end

  def generate_enumerations(input)
    # get non-removed inputs which are Enumerations and not set as constant
    enums = []

    # find enums
    input.data_fields.each do |df|

      # find enumerations
      if df['data_type'] == 'Enumeration'
        if !df['remove'] and !df['set_as_constant']
          unless df['enumerations'].nil?
            method_str = "\n#{' '*2}def #{df[:db_field_name]}_enums\n#{' '*4}[\n"

            df['enumerations'].each do |e|
              method_str = method_str + "#{' '*6}'#{e['name']}',\n"
            end
            method_str = method_str.chop.chop
            method_str = method_str + "\n#{' '*4}]\n#{' '*2}end\n"
            enums << method_str
          end
        end
      end
    end
    enums
  end
end
