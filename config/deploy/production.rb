# Simple Role Syntax
# ==================
# Supports bulk-adding hosts to roles, the primary server in each group
# is considered to be the first unless any hosts have the primary
# property set.  Don't declare `role :all`, it's a meta role.


set :rbenv_custom_path, '/opt/rbenv'
#set :rbenv_type, :system
set :user, 'deploy'
set :rbenv_ruby, 'jruby-1.7.15'
#set :tmp_dir, "/home/vagrant/tmp"
#set :ssh_options, {port: 2222, keys: ['~/.vagrant.d/insecure_private_key']}
set :rails_env, "production"
set :nginx_server_name, 'ec2-54-144-80-218.compute-1.amazonaws.com'
set :branch, :develop
server 'ec2-54-144-80-218.compute-1.amazonaws.com', user: 'ec2-user', roles: %w{web app db}


