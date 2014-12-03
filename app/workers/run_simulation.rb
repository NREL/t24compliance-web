# this is the workhorse to run the docker container.
# This method is run in the background as a delayed job task
class RunSimulation
  include Sidekiq::Worker
  sidekiq_options :retry => false, :backtrace => true

  def perform(simulation_id, run_file)
    simulation = Simulation.find(simulation_id)
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

    # Clean up some of the files that are not needed
    %w(runmanager.db).each do |f|
      logger.debug "removing file: #{run_path}/#{f}"
      File.delete File.join(run_path, f) if File.exist? File.join(run_path, f)
    end

    Dir["#{run_path}/*"].each do |f|
      if f =~ /AnalysisResults-BEES.pdf/
        logger.info "saving the compliance report path to model"
        simulation.compliance_report_pdf_path = f
      elsif f =~ /CbeccComWrapper.json/
        # Save the state based on the CbeccComWrapper.json file that is persisted
        j = MultiJson.load(File.read(f), symbolize_keys: true) if File.exist?(f)
        logger.info j

        simulation.cbecc_code = j.keys.first
        simulation.cbecc_code_description = j.values.first
      elsif f =~ /.*\s-\sab.*/
        logger.info "AB results"
      end
    end

    simulation.save!
  end
end