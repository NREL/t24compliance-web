# default[:cbecc_com_web][:ruby_path] = "/usr/bin"
# default[:cbecc_com_web][:server_path] = "/var/www/rails/openstudio"
# default[:cbecc_com_web][:rails_environment] = "development"

default[:cbecc_com_web][:ruby][:version] = 'jruby-1.7.15'
default[:cbecc_com_web][:deploy_users] = %w(ec2-user nlong vagrant kflemin apeterse)

# gui for supervisor
default['supervisor']['inet_port'] = 8080