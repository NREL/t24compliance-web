class Simulation
  include Mongoid::Document
  include Mongoid::Timestamps

  field :filename, type: String # this should be used and not passing run_path to the RunSimulation Worker
  field :status, type: String # Enum of ['init', 'queued', 'started', 'completed', 'error']
  field :percent_complete, type: Float
  field :cbecc_code, type: Integer
  field :cbecc_code_description, type: String

  # compliance report
  field :compliance_report_pdf_path, type: String

  # embeds_many :simulation_results
  belongs_to :project

  before_destroy :remove_files

  # Run the data point
  def run
    ## Temp Code
    # clear out the queue until we have proper queue management
    require 'sidekiq/api'
    Sidekiq::Queue.new.clear
    # For now just copy in the example model that we are running into the folder under the new filename
    ## End Temp Code

    RunSimulation.perform_async(id)
  end

  # This only runs on the server, so if we federate the systems, then this will not always work.
  def remove_files
    if Dir.exist? run_path
      logger.info "Removing simulation run directory #{run_path}"
      FileUtils.rm_rf run_path
    end
  end

  def run_path
    File.join(Rails.root, 'data', 'simulations', Rails.env, _id)
  end
end
