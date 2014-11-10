# Simple Role Syntax
# ==================
# Supports bulk-adding hosts to roles, the primary server in each group
# is considered to be the first unless any hosts have the primary
# property set.  Don't declare `role :all`, it's a meta role.

set :rbenv_custom_path, '/opt/rbenv'
#set :rbenv_type, :system
set :rbenv_ruby, 'jruby-1.7.15'
set :password, ask('Server password:', nil)
set :ssh_options, {port: 2222, keys: ['~/.vagrant.d/insecure_private_key']}
server 'localhost', user: 'vagrant', roles: %w{web app db}
set :rails_env, "staging"
