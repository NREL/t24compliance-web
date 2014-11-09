#
# Author:: Nicholas Long (<nicholas.long@.nrel.gov>)
# Cookbook Name:: cbecc_com_web
# Recipe:: base
#
# Configures some high level attributes and fixes cookbooks

Chef::Log.warn "Current platform is: #{node['platform']}"

if node['platform'] == 'redhat'
  override_attributes(
      :mongodb => {
          # RHEL overrides to the wrong user so force username/group to be mongodb
          :user => 'mongodb',
          :group => 'mongodb',

          # Use mongodb-org even on RHEL
          :install_method => 'mongodb-org',
          :package_name] => 'mongodb-org'
      }
  )
end
