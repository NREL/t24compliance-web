#
# Author:: Nicholas Long (<nicholas.long@.nrel.gov>)
# Cookbook Name:: cbecc_com_web
# Recipe:: sudo
#

# Sudo - careful installing this as you can easily prevent yourself from using sudo

# node.default['authorization']['sudo']['users'] = ["vagrant", "ubuntu"]

# set the sudoers files so that it has access to rbenv
secure_path = "#{node[:rbenv][:root_path]}/shims:#{node[:rbenv][:root_path]}/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
node.default['authorization']['sudo']['sudoers_defaults'] = [
    'env_reset',
    "secure_path=\"#{secure_path}\""
]
node.default['authorization']['sudo']['passwordless'] = true
node.default['authorization']['sudo']['include_sudoers_d'] = true
node.default['authorization']['sudo']['agent_forwarding'] = true
include_recipe 'sudo'