# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.hostname = "cbecc-com-web-berkshelf"

  config.vm.box = "chef/centos-6.6"

  config.omnibus.chef_version = :latest
  config.berkshelf.enabled = true

  config.vm.network "private_network", ip: "193.168.40.10"

  # Don't sync the folder for typical operation, instead call `cap vagrant deploy`
  # config.vm.synced_folder ".", "/var/www/cbecc-com-web-nfs"

  config.vm.provider "virtualbox" do |vb|
    vb.customize ['modifyvm', :id, '--memory', 2048, '--cpus', 2]
  end

  config.vm.provision "chef_zero" do |chef|
    chef.log_level = :info
    chef.roles_path = "chef/roles"
    chef.add_role "cbecc_com_web_single"
  end
end
