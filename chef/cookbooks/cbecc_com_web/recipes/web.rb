#
# Author:: Nicholas Long (<nicholas.long@.nrel.gov>)
# Cookbook Name:: cbecc_com_web
# Recipe:: web
#

# add users in a deploy group
node[:cbecc_com_web][:deploy_users].each do |u|
  group "deploy" do
    members u
    append true

    only_if "getent passwd #{u}"
  end

  group "rbenv" do
    members u
    append true

    only_if "getent passwd #{u}"
  end
end

user 'deploy' do
  gid 'deploy'
  shell "/bin/bash"
  system true
  action :create
end

# setup the www directory and the sticky bit
directory "/var/www" do
#  user 'deploy'
  group 'deploy'
  mode '02775'
end

# setup the www directory so that the group deploy can save files there
# %w(/etc/nginx/sites-available /etc/nginx/sites-enabled).each do |d|
#   directory d do
#     #user 'www-data'
#     group 'deploy'
#     mode '02775'
#     recursive true
#   end
# end
#
# # remove some of the old files as they are not needed
# bash "set_permissions_on_logs" do
#   cwd '/var/log'
#   code <<-EOH
#     chmod 02775 nginx
#     chmod 664 nginx/*
#     chown -R nginx.deploy nginx
#   EOH
# end

# Set an selinux bool to allow socket connections (need to find the sebool to allow this)
bash "set_selinux_to_permissive" do
  user 'root'
  code <<-EOH
    setenforce 0
  EOH
end


# set iptables
include_recipe "iptables"

iptables_rule "default_ip_rules"


