#
# Author:: Nicholas Long (<nicholas.long@.nrel.gov>)
# Cookbook Name:: cbecc_com_web
# Recipe:: web
#

# add users in a deploy group
node[:cbecc_com_web][:deploy_users].each do |u|
  group 'deploy' do
    members u
    append true

    only_if "getent passwd #{u}"
  end

  group 'rbenv' do
    members u
    append true

    only_if "getent passwd #{u}"
  end
end

user 'deploy' do
  gid 'deploy'
  shell '/bin/bash'
  system true
  action :create
end

# setup the www directory and the sticky bit
directory '/var/www' do
  #  user 'deploy'
  group 'deploy'
  mode '02775'
end

# Remove the default site which seems to be installed in the conf.d directory and is loaded.
bash 'delete_nginx_default_site' do
  cwd 'etc/nginx/conf.d'
  code <<-EOH
    rm -f default.conf
  EOH
end

# Set an selinux bool to allow socket connections (need to find the sebool to allow this)
bash 'set_selinux_to_permissive' do
  user 'root'
  code <<-EOH
    setenforce 0
  EOH

  only_if { ::File.exist?('/usr/sbin/setenforce') }
end

# set the memory higher in jruby
template '/etc/sudoers.d/jruby.sh' do
  source 'jruby.sh.erb'
  mode '0775'
  owner 'root'
  group 'root'
end

# create a secret file for the environment
require 'securerandom'
template '/etc/profile.d/cbecc_secrets.sh' do
  source 'cbecc_secrets.sh.erb'
  mode '0750'
  owner 'root'
  group 'deploy'
  variables(
      {
          :secret_key_base => SecureRandom.hex(64),
          :devise_secret_key => SecureRandom.hex(64)
      }
  )
end


# set iptables
include_recipe 'iptables'

iptables_rule 'default_ip_rules'



