# Simple Role Syntax
# ==================
# Supports bulk-adding hosts to roles, the primary server in each group
# is considered to be the first unless any hosts have the primary
# property set.  Don't declare `role :all`, it's a meta role.

set :rbenv_custom_path, '/opt/rbenv'
# set :rbenv_type, :system
set :user, 'vagrant'
set :rbenv_ruby, 'jruby-1.7.15'
set :tmp_dir, '/home/vagrant/tmp'
set :ssh_options, port: 2222, keys: ['.vagrant/machines/default/virtualbox/private_key']
set :rails_env, 'staging'
set :nginx_server_name, 'local.cbecc-com-web'
set :branch, :develop
server 'localhost', user: 'vagrant', roles: %w(web app db)
