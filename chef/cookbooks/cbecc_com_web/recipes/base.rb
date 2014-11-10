#
# Author:: Nicholas Long (<nicholas.long@.nrel.gov>)
# Cookbook Name:: cbecc_com_web
# Recipe:: base
#
# Configures some high level attributes and fixes cookbooks

Chef::Log.warn "Current platform is: #{node['platform']}"

if node['platform'] == 'redhat'
  # On RHEL use the mongodb-org package as well
  node.override[:mongodb][:install_method] = 'mongodb-org'
  node.override[:mongodb][:package_name] = 'mongodb-org'
end
