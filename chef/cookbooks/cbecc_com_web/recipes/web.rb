#
# Author:: Nicholas Long (<nicholas.long@.nrel.gov>)
# Cookbook Name:: cbecc_com_web
# Recipe:: web
#

# add users in a deploy group
%w(nlong vagrant kflemin).each do |u|
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

# setup the www directory
directory "/var/www" do
  #user 'www-data'
  group 'deploy'
  mode '0775'
  #action :create
end

# set the gid sticky bit so that any subfolder would be part of the deploy group
bash "chmod-setgid" do
  code "chmod g+s /var/www"
end

# setup the www directory
%w(/etc/nginx/sites-available /etc/nginx/sites-enabled).each do |d|
  directory d do
    #user 'www-data'
    group 'deploy'
    mode '0775'
  end
end

# set ip tables
include_recipe "iptables"
iptables_rule "default_ip_rules"
