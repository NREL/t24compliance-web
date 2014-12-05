class Simulation
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :filename, type: String
  field :status, type: String
  field :cbecc_code, type: Integer
  field :cbecc_code_description, type: String

  # compliance report
  field :compliance_report_pdf_path, type: String

  #embeds_many :simulation_results

  # Run the data point
  def run_docker
    run_dir = File.join(Rails.root, 'data', 'simulations', self._id)
    FileUtils.mkdir_p run_dir

    ## Temp Code
    # clear out the queue until we have proper queue management
    require 'sidekiq/api'
    Sidekiq::Queue.new.clear
    # For now just copy in the example model that we are running into the folder under the new filename

    test_file = File.join(Rails.root, 'spec/files/cbecc_com_instances/0200016-OffSml-SG-BaseRun.xml')
    run_file = File.join(run_dir, File.basename(test_file))
    ## End Temp Code

    if File.exists? run_file
      fail "File #{run_file} already exists. Cannot run the analysis."
    end
    FileUtils.copy test_file, run_file

    RunSimulation.perform_async(self.id, run_file)
  end
end
