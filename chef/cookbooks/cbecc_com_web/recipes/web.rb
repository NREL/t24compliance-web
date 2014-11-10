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

bash "chmod-setgid" do
  code "chmod g+s /var/www"
end
