namespace :sim do

  desc "import input fields"
  task :docker_test => :environment do
    require 'docker'

    if ENV['DOCKER_HOST']
      puts "Docker URL is #{ENV['DOCKER_HOST']}:#{ENV['DOCKER_HOST'].class}"

    else
      fail "No Docker IP found. Set DOCKER_HOST ENV variable to the Docker socket"
    end

    # If you are using boot2docker, then you have to deal with all these shananigans
    # https://github.com/swipely/docker-api/issues/202

    cert_path = File.expand_path ENV['DOCKER_CERT_PATH']

    Docker.options = {
        client_cert: File.join(cert_path, 'cert.pem'),
        client_key: File.join(cert_path, 'key.pem'),
        ssl_ca_file: File.join(cert_path, 'ca.pem'),
        scheme: 'https' # This is important when the URL starts with tcp://
    }

    Docker.url = ENV['DOCKER_HOST']

    # What is the longest timeout?
    DOCKER_CONTAINER_TIMEOUT = 30 * 60 # 30 minutes
    Excon.defaults[:write_timeout] = DOCKER_CONTAINER_TIMEOUT
    Excon.defaults[:read_timeout] = DOCKER_CONTAINER_TIMEOUT

    puts Docker.version

    # Example file to run
    current_dir = Dir.pwd
    begin
      sim_path = File.expand_path('test/integration/files/cbecc_com_files/0200016-OffSml-SG-BaseRun.xml')
      fail "Simulation file does not exist: #{sim_path}" unless File.exist? sim_path

      Dir.chdir(File.dirname(sim_path))
      puts "Current working directory is: #{Dir.getwd}"

      run_command = %W[/var/cbecc-com-files/run.sh -i /var/cbecc-com-files/run/#{File.basename(sim_path)}]
      #run_command = %w[find . -name *]
      c = Docker::Container.create('Cmd' => run_command,
                                   'Image' => 'nllong/cbecc-com:daemon',
                                   'AttachStdout' => true,
                                   #'Volumes' => {"/var/cbecc-com-files/run" => {}}
      )

      require 'pp'
      #pp c.json
      c.start('Binds' => ["#{File.dirname(sim_path)}:/var/cbecc-com-files/run/"])

      # this command is kind of weird. From what I understand, this is the container timeout (defaults to 60 seconds)
      # This may be of interest: http://kimh.github.io/blog/en/docker/running-docker-containers-asynchronously-with-celluloid/
      c.wait(DOCKER_CONTAINER_TIMEOUT)
      stdout, stderr = c.attach(:stream => false, :stdout => true, :stderr => true, :logs => true)

      puts stdout
    ensure
      Dir.chdir(current_dir)
    end


  end

end