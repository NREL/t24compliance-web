# this is the workhorse to run the docker container.
# This method is run in the background as a delayed job task. If you change this file, then you will need to
# restart SideKiq

class RunSimulation
  include Sidekiq::Worker
  sidekiq_options :retry => false, :backtrace => true

  def perform(simulation_id)
    simulation = Simulation.find(simulation_id)


    if Dir.exist? simulation.run_path
      logger.warn "Run for '#{simulation.project.name}' in directory '#{simulation.run_path}' already exists. Deleting simulation results..."
      FileUtils.rm_rf simulation.run_path
    end
    run_filename = 'in.xml'
    FileUtils.mkdir_p simulation.run_path

    # save the xml instance
    simulation.project.xml_save("#{simulation.run_path}/#{run_filename}")

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
    docker_container_timeout = 60 * 60 # 60 minutes  # how to catch a timeout error?  test this?
    Excon.defaults[:write_timeout] = docker_container_timeout
    Excon.defaults[:read_timeout] = docker_container_timeout

    current_dir = Dir.pwd
    begin
      fail "Simulation file does not exist: #{File.join(simulation.run_path, run_filename)}" unless File.exist? File.join(simulation.run_path, run_filename)

      Dir.chdir(simulation.run_path)
      puts "Current working directory is: #{Dir.getwd}"

      run_command = %W[/var/cbecc-com-files/run.sh -i /var/cbecc-com-files/run/#{run_filename}]
      c = Docker::Container.create('Cmd' => run_command,
                                   'Image' => 'nllong/cbecc-com',
                                   'AttachStdout' => true
      )
      c.start('Binds' => ["#{simulation.run_path}:/var/cbecc-com-files/run/"])

      # Per NEM: Check for tail gem. Most likely will have to be a separate thread.
      #t = Thread.new {
      # Look at File::Tail (http://flori.github.io/file-tail/doc/index.html)
      #  # parse the log file
      #while
      #  simulation.status = 'running'
      #  simulation.save!
      #end

      #}

      # this command is kind of weird. From what I understand, this is the container timeout (defaults to 60 seconds)
      # This may be of interest: http://kimh.github.io/blog/en/docker/running-docker-containers-asynchronously-with-celluloid/
      c.wait(docker_container_timeout)

      # Kill the monitoring thread
      #t.kill

      stdout, stderr = c.attach(:stream => false, :stdout => true, :stderr => true, :logs => true)

      logger.debug stdout
      logger.info "Finished running simulation"
    ensure
      Dir.chdir current_dir
    end

    # Clean up some of the files that are not needed
    %w(runmanager.db).each do |f|
      logger.debug "removing file: #{simulation.run_path}/#{f}"
      File.delete File.join(simulation.run_path, f) if File.exist? File.join(simulation.run_path, f)
    end

    Dir["#{simulation.run_path}/*"].each do |f|
      if f =~ /AnalysisResults-BEES.pdf/
        logger.info "saving the compliance report path to model"
        simulation.compliance_report_pdf_path = f
      elsif f =~ /.*\s-\sAnalysisResults-BEES.xml/
        logger.info "BEES XML #{f}"
      elsif f =~ /.*\s-\sAnalysisResults.xml/
        logger.info "XML #{f}"
      elsif f =~ /CbeccComWrapper.json/
        # Save the state based on the CbeccComWrapper.json file that is persisted
        j = MultiJson.load(File.read(f), symbolize_keys: true) if File.exist?(f)
        logger.info "pyCBECC responded with: #{j}"

        simulation.cbecc_code = j.keys.first.to_s.to_i
        simulation.cbecc_code_description = j.values.first
      elsif f =~ /.*.log/

      elsif f =~ /.*\s-\sab.*/
        logger.info "Annual baseline results #{f}"
      elsif f =~ /.*\s-\szb.*/
        logger.info "Sizing simulation results #{f}"
      elsif f =~ /.*\s-\sap.*/
        logger.info "Annual proposed results #{f}"
      end
    end

    simulation.save!
  end
end