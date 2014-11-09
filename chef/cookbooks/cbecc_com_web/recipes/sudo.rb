#
# Author:: Nicholas Long (<nicholas.long@.nrel.gov>)
# Cookbook Name:: cbecc_com_web
# Recipe:: sudo
#

# Sudo - careful installing this as you can easily prevent yourself from using sudo
#   NREL: make sure wheel is in the groups below
# node.default['authorization']['sudo']['users'] = ["nlong", "kflemin"]

# Add in NREL's UnixISO and rsa groups
node.default['authorization']['sudo']['groups'] = ["wheel", "UnixISOServerAdmins", "rsa"]

# set the sudoers files so that it has access to rbenv
if node[:rbenv]
  secure_path = "#{node[:rbenv][:root_path]}/shims:#{node[:rbenv][:root_path]}/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
else
  secure_path = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
end

node.default['authorization']['sudo']['sudoers_defaults'] = [
  '!visiblepw',
  'env_reset',
  'env_keep =  "COLORS DISPLAY HOSTNAME HISTSIZE INPUTRC KDEDIR LS_COLORS"',
  'env_keep += "MAIL PS1 PS2 QTDIR USERNAME LANG LC_ADDRESS LC_CTYPE"',
  'env_keep += "LC_COLLATE LC_IDENTIFICATION LC_MEASUREMENT LC_MESSAGES"',
  'env_keep += "LC_MONETARY LC_NAME LC_NUMERIC LC_PAPER LC_TELEPHONE"',
  'env_keep += "LC_TIME LC_ALL LANGUAGE LINGUAS _XKB_CHARSET XAUTHORITY"',
  'env_keep += "HOME"',
  'always_set_home',
  "secure_path=\"#{secure_path}\""
]

node.default['authorization']['sudo']['include_sudoers_d'] = true
node.default['authorization']['sudo']['agent_forwarding'] = true
include_recipe 'sudo'

# Add in NREL's comvault group for package installation. This makes a file in sudoers.d/
sudo 'comvault' do
  group 'cvadmin'
  nopasswd true
end
