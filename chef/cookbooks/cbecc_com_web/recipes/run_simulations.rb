# Author:: Nicholas Long (<nicholas.long@.nrel.gov>)
# Cookbook Name:: cbecc_com_web
# Recipe:: run_simulations
#

# install redis
include_recipe 'redis2'

redis_instance 'cbecc_com_queue'

include_recipe 'docker' # need to make sure that we upgrade the daemon to 1.5

include_recipe 'supervisor'

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
  command '/var/www/cbecc-com-web/current/sidekiq.sh'
  directory '/mnt/repos/cofee-grinder'
  autostart false
  autorestart true
  redirect_stderr true
  stdout_logfile '/var/log/supervisor/sidekiq.log'
  user "deploy"
  #pidfile '/var/www/cbecc-com-web/shared/pids/sidekiq.pid'
  action :enable
end

# sidekiq
# directory "/opt/local/bin" do
#   owner 'deploy'
#   group 'deploy'
#   recursive true
#   mode '0775'
# end
# include_recipe "sidekiq"
#
# sidekiq "cbecc_com_queue_sidekiq" do
#   user "deploy"
#   concurrency 1
#   processes 1
#   queues "queue" => 5
# end
