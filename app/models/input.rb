class Input
  include Mongoid::Document

  field :name, type: String  #abbreviation
  field :display_name, type: String
  field :parents, type: Array
  field :children, type: Array
  field :notes, type: String  # catch-all
  field :data_fields, type: Array

  def self.import_from_json(filename)
    if File.exists?(filename)
      json = MultiJson.load(File.read(filename), symbolize_keys: true)

      json.each do |input|
        # If you don't delete the _id, then it will override the existing (? i think)
        input.delete :_id
        logger.info "Importing '#{input[:name]}'"

        a = Input.new(input)
        a.save!
      end
    else
      logger.error "JSON file does not exist: #{filename}"
    end
  end
end
