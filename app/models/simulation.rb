class Simulation
  include Mongoid::Document
  include Mongoid::Timestamps

  field :filename, type: String
  field :status, type: String
  field :cbecc_code, type: Integer
  field :cbecc_code_description, type: String

  # compliance report
  field :compliance_report_pdf_path, type: String

  #embeds_many :simulation_results

  # Run the data point. The question I have here is whether or not this can be accessed from delayed_job
  def run_docker
    run_dir = File.join(Rails.root, 'data', 'simulations', self._id)
    FileUtils.mkdir_p run_dir

    # For now just copy in the example model that we are running into the folder under the new filename
    test_file = File.join(Rails.root, 'test/integration/files/cbecc_com_files/0200016-OffSml-SG-BaseRun.xml')
    run_file = File.join(run_dir, File.basename(test_file))

    if File.exists? run_file
      fail "File #{run_file} already exists. Cannot run the analysis."
    end
    FileUtils.copy test_file, run_file

    run_cbecc_com(run_file)

    # Post process the simulation

    # Clean up some of the files that are not needed

    %w(runmanager.db).each do |f|
      logger.debug "removing file: #{run_path}/#{f}"
      File.delete File.join(run_path, f) if File.exist? File.join(run_path, f)
    end

    # Save the state based on the CbeccComWrapper.json file that is persisted
    result_file = File.join(run_path, "CbeccComWrapper.json")

    Dir["#{run_path}/*"].each do |f|
      if f =~ /AnalysisResults-BEES.pdf/
        logger.info "saving the compliance report path to model"
        self.compliance_report_pdf_path = f
      elsif f =~ /CbeccComWrapper.json/
        j = MultiJson.load(File.read(f), symbolize_keys: true) if File.exist?(f)
        logger.info j

        self.cbecc_code = j.keys.first
        self.cbecc_code_description = j.values.first
      elsif f =~ /.*\s-\sab.*/
        logger.info "AB results"
      end
    end

    self.save!
  end
#  handle_asynchronously :run_docker


  # The previous method should be run, then this is the actual workhorse to run the docker container.
  # This method is run in the background as a delayed job task
  def run_cbecc_com(run_file)
    run_path = File.dirname(run_file)
    run_filename = File.basename(run_file)


            # This section needs to go into an initializer
            # If you are using boot2docker, then you have to deal with all these shananigans
            # https://github.com/swipely/docker-api/issues/202
            if ENV['DOCKER_HOST']
              logger.info "Docker URL is #{ENV['DOCKER_HOST']}:#{ENV['DOCKER_HOST'].class}"
            else
              fail "No Docker IP found. Set DOCKER_HOST ENV variable to the Docker socket"
            end

            cert_path = File.expand_path ENV['DOCKER_CERT_PATH']
            Docker.options = {
                client_cert: File.join(cert_path, 'cert.pem'),
                client_key: File.join(cert_path, 'key.pem'),
                ssl_ca_file: File.join(cert_path, 'ca.pem'),
                scheme: 'https' # This is important when the URL starts with tcp://
            }
            Docker.url = ENV['DOCKER_HOST']

            # What is the longest timeout?
            docker_container_timeout = 30 * 60 # 30 minutes
            Excon.defaults[:write_timeout] = docker_container_timeout
            Excon.defaults[:read_timeout] = docker_container_timeout


    current_dir = Dir.pwd
    begin
      fail "Simulation file does not exist: #{run_file}" unless File.exist? run_file

      Dir.chdir(run_path)
      puts "Current working directory is: #{Dir.getwd}"

      run_command = %W[/var/cbecc-com-files/run.sh -i /var/cbecc-com-files/run/#{run_filename}]
      c = Docker::Container.create('Cmd' => run_command,
                                   'Image' => 'nllong/cbecc-com:daemon',
                                   'AttachStdout' => true,
      )
      c.start('Binds' => ["#{run_path}:/var/cbecc-com-files/run/"])

      # this command is kind of weird. From what I understand, this is the container timeout (defaults to 60 seconds)
      # This may be of interest: http://kimh.github.io/blog/en/docker/running-docker-containers-asynchronously-with-celluloid/
      c.wait(docker_container_timeout)
      stdout, stderr = c.attach(:stream => false, :stdout => true, :stderr => true, :logs => true)

      logger.debug stdout
      logger.info "Finished running simulation"
    ensure
      Dir.chdir current_dir
    end
  end

end
