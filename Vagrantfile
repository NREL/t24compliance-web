# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # All Vagrant configuration is done here. The most common configuration
  # options are documented and commented below. For a complete reference,
  # please see the online documentation at vagrantup.com.

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "chef/centos-6.6"

  config.omnibus.chef_version = "latest"

  config.berkshelf.enabled = true

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: "193.168.40.10"

  # Don't sync the folder for typical operation, instead call `cap vagrant deploy`
  config.vm.synced_folder ".", "/var/www/cbecc-com-web-nfs"

  # config.vm.provider "virtualbox" do |vb|
  #   # Don't boot with headless mode
  #   vb.gui = true
  #
  #   # Use VBoxManage to customize the VM. For example to change memory:
  #   vb.customize ["modifyvm", :id, "--memory", "1024"]
  # end
  #
  # View the documentation for the provider you're using for more
  # information on available options.

  config.vm.provider :aws do |aws, override|
    begin
      override.vm.box = 'dummy'
      override.vm.box_url = 'http://github.com/mitchellh/vagrant-aws/raw/master/dummy.box'

      # do not sync the folder
      override.vm.synced_folder = nil

      # Check to make sure all the env variables are set for creating the AMIs
      %w(AWS_ACCESS_KEY AWS_SECRET_KEY AWS_SSH_KEY_ID EC2_REGION AWS_PRIVATE_KEY_PATH).each do |c|
        warn "[WARNING] Environment variable for #{c} is not set. Assuming no AWS provider, will continue..." unless ENV[c]
      end

      aws.access_key_id = ENV['AWS_ACCESS_KEY']
      aws.secret_access_key = ENV['AWS_SECRET_KEY']
      aws.keypair_name = ENV['AWS_SSH_KEY_ID']
      aws.region = ENV['EC2_REGION']
      override.ssh.private_key_path = ENV['AWS_PRIVATE_KEY_PATH']

      #aws.associate_public_ip = true
      #aws.elastic_ip = true
      #aws.subnet_id = 'subnet-8c9f17fb'
      #aws.security_groups = ['sg-ae1acdca','sg-9bdc09ff']
      aws.block_device_mapping = [{ 'DeviceName' => '/dev/sda1', 'Ebs.VolumeSize' => 100 }]

      # http://www.ec2instances.info/
      # aws.instance_type = "m3.medium" # $0.07 / hour, 1 core, slow network
      # aws.instance_type = 'm3.large' # $0.14 / hour, 2 cores, moderate network
      aws.instance_type = "m3.xlarge" # $0.28 / hour, 4 cores, moderate network

      aws.ami = 'ami-b66ed3de'  # Amazon Linux HVM EBS-Backed 64-bit
      override.ssh.username = 'ec2-user'
      override.ssh.pty = true
      aws.tags = {
          'Name' => 'T24 Compliance - Vagrant',
          'NodeType' => 'Server'
      }
    rescue LoadError
      warn 'Unable to configure AWS provider.'
    end
  end


  config.vm.provision "chef_solo" do |chef|
    chef.cookbooks_path = "chef/cookbooks"
    chef.roles_path = "chef/roles"

    chef.add_role "cbecc_com_web_single"
  end
end
