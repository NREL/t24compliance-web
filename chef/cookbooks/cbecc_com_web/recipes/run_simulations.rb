# Author:: Nicholas Long (<nicholas.long@.nrel.gov>)
# Cookbook Name:: cbecc_com_web
# Recipe:: run_simulations
#

# install redis
include_recipe 'redis2'

redis_instance 'cbecc_com_queue'

include_recipe 'docker' # need to make sure that we upgrade the daemon to 1.5

# This is silly, but the supervisor cookbook uses the python prefix in the supervisor daemon
node.set['python']['prefix_dir'] = '/usr/local'
#node['python']['prefix_dir']
include_recipe 'supervisor'
node.set['python']['prefix_dir'] = '/usr'

# add users in a deploy group
node[:cbecc_com_web][:deploy_users].each do |u|
  group 'docker' do
    members u
    append true

    only_if "getent passwd #{u}"
  end
end

docker_image 'nllong/cbecc-com' do
  tag 'latest'
  cmd_timeout 20 * 60 # 20 minutes
end

# supervisor tasks
supervisor_service "sidekiq" do
  command '/usr/local/bin/pidproxy /var/www/cbecc-com-web/shared/tmp/pids/sidekiq.pid /var/www/cbecc-com-web/shared/bin/sidekiq.sh'
  autostart false
  autorestart true
  redirect_stderr true
  stdout_logfile '/var/log/supervisor/sidekiq.log'
  user "deploy"
  action :enable
end
