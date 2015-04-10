# The workhorse to run the docker container with CBECC-Com.

# This method is run in the background as a delayed job task. If you change this file, then you will need to
# restart SideKiq

class RunSimulation
  include Sidekiq::Worker
  sidekiq_options retry: 1 #, backtrace: true

  # TIMEOUT for docker container (and log file)
  TIMEOUT = 3600 # seconds

  def perform(simulation_id)
    @simulation = Simulation.find(simulation_id)
    @simulation.clear_results
    @simulation.remove_files
    @simulation.save!

    # Make sure to initialize all the model variables
    success = false
    status_message = ''

    current_dir = Dir.pwd
    File.delete "#{@simulation.run_path}/docker_run.receipt" if File.exist? "#{@simulation.run_path}/docker_run.receipt"
    threads = []
    begin
      @simulation.status = 'started'
      @simulation.save!

      if Dir.exist? @simulation.run_path
        logger.warn "Run for '#{@simulation.project.name}' in directory '#{@simulation.run_path}' already exists. Deleting simulation results..."
        FileUtils.rm_rf @simulation.run_path
      end
      run_filename = 'in.xml'
      FileUtils.mkdir_p @simulation.run_path

      # save the xml instance
      @simulation.project.xml_save("#{@simulation.run_path}/#{run_filename}")
      fail "Simulation file does not exist: #{File.join(@simulation.run_path, run_filename)}" unless File.exist? File.join(@simulation.run_path, run_filename)

      # This section needs to go into an initializer
      # If you are using boot2docker, then you have to deal with all these shananigans
      # https://github.com/swipely/docker-api/issues/202
      ENV['DOCKER_URL'] = ENV['DOCKER_HOST'] if ENV['DOCKER_HOST']
      if ENV['DOCKER_URL']
        logger.info "Docker URL is #{ENV['DOCKER_URL']}:#{ENV['DOCKER_URL'].class}"
        cert_path = File.expand_path ENV['DOCKER_CERT_PATH']
        Docker.options = {
            client_cert: File.join(cert_path, 'cert.pem'),
            client_key: File.join(cert_path, 'key.pem'),
            ssl_ca_file: File.join(cert_path, 'ca.pem'),
            scheme: 'https' # This is important when the URL starts with tcp://
        }
        logger.info "Docker options are set to #{Docker.options}"
      else
        ENV['DOCKER_URL'] = 'unix:///var/run/docker.sock' unless ENV['DOCKER_URL']
        logger.info 'No Docker IP found. Assuming that you are running Docker locally (on linux with a socket) if not, set DOCKER_URL ENV variable to the Docker socket'
      end

      # Kill after 1 hour at the moment
      logger.info "Setting Excon timeouts to #{60*60} seconds"
      Excon.defaults[:write_timeout] = RunSimulation::TIMEOUT
      Excon.defaults[:read_timeout] = RunSimulation::TIMEOUT
      Excon.defaults[:ssl_verify_peer] = false

      # check if docker is alive
      fail 'Docker is not running!' unless Docker.validate_version!

      Dir.chdir(@simulation.run_path)
      logger.info "Current working directory is: #{Dir.getwd}"

      run_command = %W(/var/cbecc-com-files/run.sh -i /var/cbecc-com-files/run/#{run_filename})
      logger.info "Docker run method is: #{run_command}"
      c = Docker::Container.create({'Cmd' => run_command,
                                    'Image' => 'nllong/cbecc-com',
                                    'AttachStdout' => true}
      )
      logger.info "Docker container is: #{c.inspect}"
      c.start('Binds' => ["#{@simulation.run_path}:/var/cbecc-com-files/run/"])

      # Tailing thread
      threads << Thread.new do
        begin
          Timeout.timeout(RunSimulation::TIMEOUT) do
            # Look at File::Tail (http://flori.github.io/file-tail/doc/index.html)
            loop_count = 0
            tail_thread = nil
            loop do
              # wait until the log file is found, then start a new thread for monitoring the process. Do
              # not join this thread with the others.

              if tail_thread.nil? && find_log_file && File.exist?(find_log_file)
                tail_thread = Thread.new do
                  logger.info "Starting thread to parse the log file"
                  File::Tail::Logfile.tail(find_log_file) do |line|
                    determine_percent_complete(line) if line =~ /.*PerfAnal_CECNRes.*$/
                  end
                end
              else
                logger.info "Checking for the existence of a log file -- iteration #{loop_count += 1}" if tail_thread.nil?
              end

              logger.info "Checking for completion of task from the Log Thread... waiting"
              sleep 5

              if File.exist? "#{@simulation.run_path}/docker_run.receipt"
                logger.info "Docker task has completed, killing the Log Thread"
                break
              end
            end
          end
        rescue Timeout::Error
          logger.info "Log parsing raised a timeout error"
        end
      end

      logger.info "Threading Docker wait..."
      threads << Thread.new do
        # remove the 'receipt' file
        File.delete "#{@simulation.run_path}/docker_run.receipt" if File.exist? "#{@simulation.run_path}/docker_run.receipt"
        begin
          # this command is kind of weird. From what I understand, this is the container timeout (defaults to 60 seconds)
          # This may be of interest: http://kimh.github.io/blog/en/docker/running-docker-containers-asynchronously-with-celluloid/
          c.wait(RunSimulation::TIMEOUT)
        rescue => e
          logger.error "Docker wait thread exception #{e.message}"
        ensure
          File.open("#{@simulation.run_path}/docker_run.receipt", 'w') { |f| f << Time.now }
          logger.info "Docker wait finished"
        end
      end
      threads.each { |t| t.join }

      logger.info 'Finished running simulation'
      success = process_results

      unless @simulation.save!
        success = false
        status_message = 'Could not save the object back into the database'
      end
    rescue => e
      m = "Exception raised: #{e.message}:#{e.backtrace.join("\n")}"
      logger.error m
      @simulation.status_message = e.message

      # make sure to fail out so sidekiq knows that this is a dead job and should retry if able
      fail m
    ensure
      Dir.chdir current_dir
      @simulation.status = success ? 'completed' : 'error'
      update_percent_complete(100, 'Completed')
      @simulation.status_message = status_message
      @simulation.save!
    end
  end

  private

  def process_results
    # Clean up some of the files that are not needed
    %w(runmanager.db).each do |f|
      logger.debug "Removing file: #{@simulation.run_path}/#{f}"
      File.delete File.join(@simulation.run_path, f) if File.exist? File.join(@simulation.run_path, f)
    end

    Dir["#{@simulation.run_path}/*"].each do |f|
      if f =~ /AnalysisResults-BEES.pdf/
        logger.info 'saving the compliance report path to model'
        @simulation.compliance_report_pdf_path = f
      elsif f =~ /.*\s-\sAnalysisResults-BEES.xml/
        logger.info "BEES XML #{f}"
        #@simulation.
      elsif f =~ /.*\s-\sAnalysisResults.xml/
        logger.info "XML #{f}"
      elsif f =~ /CbeccComWrapper.json/
        # Save the state based on the CbeccComWrapper.json file that is persisted
        json = MultiJson.load(File.read(f), symbolize_keys: true) if File.exist?(f)
        logger.info "pyCBECC responded with: #{json}"

        @simulation.cbecc_code = json.keys.first.to_s.to_i
        @simulation.cbecc_code_description = json.values.first
      elsif f =~ /.*\s-\sab.*/
        logger.info "Annual baseline results #{f}"
      elsif f =~ /.*\s-\szb.*/
        logger.info "Sizing simulation results #{f}"
      elsif f =~ /.*\s-\sap.*/
        logger.info "Annual proposed results #{f}"
      end
    end

    # parse the log file for any errors
    errors = []
    log_file = find_log_file
    if log_file && File.exist?(log_file)
      s = File.read log_file
      s.scan(/Error:\s{2}.*$/).each do |error|
        errors << error[/Error:\s{2}(.*)/, 1].chomp
      end

      @simulation.error_messages = errors
    end

    # success is defined as no error messages
    @simulation.error_messages.empty?
  end

  # Parse the log string that had the perform analysis step to determine the state of the overall analysis
  # @param log_string [String] String from the CBECC-Com log to parse
  # @return nil
  def determine_percent_complete(log_string)
    message = log_string[/.*PerfAnal_CECNRes.-.(.*)$/, 1].chomp
    update_percent_complete(5, message)

    # find where we are
    states = [
        {/initializing ruleset/i => 0.440528634355686},
        {/loading sdd model/i => 1.32158590308396},
        {/back from loading sdd model/i => 1.32158590308396},
        {/defaulting model/i => 1.76211453744387},
        {/defaulting model/i => 2.6431718061637},
        {/writing user input to analysis results xml/i => 3.08370044052783},
        {/checking sdd model/i => 3.08370044052783},
        {/preparing model zb/i => 3.08370044052783},
        {/calling perfsim_e. for zb model/i => 3.52422907489197},
        {/back from perfsim_e. (zb model, 0 return value)/i => 35.2422907488986},
        {/exporting zb model details to results xml/i => 35.2422907488986},
        {/preparing model ap/i => 35.2422907488986},
        {/calling perfsim_e. for ap model/i => 35.6828193832585},
        {/back from perfsim_e. (ap model, 0 return value)/i => 35.6828193832585},
        {/preparing model ab/i => 35.6828193832585},
        {/calling perfsim_e. for ab model/i => 35.6828193832585},
        {/back from perfsim_e. (ab model, 0 return value)/i => 100},
        {/umlh check on ab model/i => 100},
        {/exporting ab model details to results xml/i => 100}
    ]

    states.reverse.each do |s|
      if log_string =~ s.keys.first
        update_percent_complete(s.values.first, message)
        break
      end
    end
  end

  # Update the percent complete in the database and the status_message (if supplied)
  # @param percent [Float] Value to set the simulation complete
  # @param message [String] Message to display to the user on the current state
  def update_percent_complete(percent, message)
    @simulation.percent_complete_message << message if @simulation.percent_complete_message.last != message
    @simulation.percent_complete = percent
    @simulation.save!
  end

  # Use glob to find the log file for the existing simulation. This assumes that CBECC-Com only writes
  # out a single log file
  def find_log_file
    Dir["#{@simulation.run_path}/*.log"].first
  end

end
