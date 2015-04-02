namespace :sim do
  desc 'test docker'
  task docker_test: :environment do
    if ENV['DOCKER_HOST']
      puts "Docker URL is #{ENV['DOCKER_HOST']}:#{ENV['DOCKER_HOST'].class}"
    else
      fail 'No Docker IP found. Set DOCKER_HOST ENV variable to the Docker socket'
    end

    # This section needs to go into an initializer
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
    docker_container_timeout = 30 * 60 # 30 minutes
    Excon.defaults[:write_timeout] = docker_container_timeout
    Excon.defaults[:read_timeout] = docker_container_timeout

    # Example file to run
    current_dir = Dir.pwd
    begin
      sim_path = File.expand_path('spec/files/cbecc_com_instances/0200016-OffSml-SG-BaseRun.xml')
      fail "Simulation file does not exist: #{sim_path}" unless File.exist? sim_path

      Dir.chdir(File.dirname(sim_path))
      puts "Current working directory is: #{Dir.getwd}"

      run_command = %W(/var/cbecc-com-files/run.sh -i /var/cbecc-com-files/run/#{File.basename(sim_path)})
      # run_command = %w[find . -name *]
      c = Docker::Container.create('Cmd' => run_command,
                                   'Image' => 'nllong/cbecc-com',
                                   'AttachStdout' => true,
      # 'Volumes' => {"/var/cbecc-com-files/run" => {}}
      )

      c.start('Binds' => ["#{File.dirname(sim_path)}:/var/cbecc-com-files/run/"])

      # this command is kind of weird. From what I understand, this is the container timeout (defaults to 60 seconds)
      # This may be of interest: http://kimh.github.io/blog/en/docker/running-docker-containers-asynchronously-with-celluloid/
      c.wait(docker_container_timeout)
      stdout, stderr = c.attach(stream: false, stdout: true, stderr: true, logs: true)

      puts stdout
    ensure
      Dir.chdir(current_dir)
    end
  end

  desc 'import test project'
  task import_test_project: :environment do
    Rails.logger = Logger.new(STDOUT)

    # import some cbecc com models
    u = User.find_by(email: 'test@nrel.gov')

    # are we sure that we want to destroy all the users projects?
    u.projects.destroy_all

    files = []
    # files += [File.join(Rails.root, "spec/files/cbecc_com_instances/0200016-OffSml-SG-BaseRun.xml")]
    files += Dir['spec/files/cbecc_com_web_instances/*.xml']
    files.each do |f|
      p = Project.from_sdd_xml(f)
      p.user_id = u.id
      p.save!
      puts "Imported #{p.name}"

      # round trip testing
      p.xml_save("#{File.dirname(f)}/#{File.basename(f, '.*')}.out")
    end
  end
end
