class Simulation
  include Mongoid::Document
  include Mongoid::Timestamps

  field :filename, type: String # this should be used and not passing run_path to the RunSimulation Worker
  field :status, type: String # Enum of ['init', 'queued', 'started', 'completed', 'error']
  field :status_message, type: String # message regarding the status (e.g. why the simulation encountered an error)
  field :percent_complete, type: Float
  field :percent_complete_message, type: Array, default: [] # string on what the simulation is doing
  field :cbecc_code, type: Integer
  field :cbecc_code_description, type: String
  field :error_messages, type: Array
  field :job_id, type: String

  # reports
  field :compliance_report_pdf_path, type: String
  field :compliance_report_xml, type: String
  field :openstudio_model_proposed, type: String
  field :openstudio_model_baseline, type: String
  field :results_zip_file, type: String

  # embeds_many :simulation_results
  belongs_to :project

  before_destroy :remove_files

  # Run the data point
  def run
    # clear out all the data in database and on disk (note that this is also called from the worker)
    clear_results
    remove_files

    #require 'sidekiq/api'

    self.job_id = RunSimulation.perform_async(id)
    self.save!
  end

  # This only runs on the server, so if we federate the systems, then this will not always work.
  def remove_files
    if Dir.exist? run_path
      logger.info "Removing simulation run directory #{run_path}"
      FileUtils.rm_rf run_path
    end
  end

  def clear_results
    self.status = 'init'
    self.percent_complete = 0
    self.cbecc_code = nil
    self.cbecc_code_description = ''
    self.error_messages = []
    self.percent_complete_message = []

    self.save!
  end

  def run_path
    File.join(Rails.root, 'data', 'simulations', Rails.env, _id)
  end

end
