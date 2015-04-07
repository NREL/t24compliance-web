# Author:: Nicholas Long (<nicholas.long@.nrel.gov>)
# Cookbook Name:: cbecc_com_web
# Recipe:: run_simulations
#

# install redis
include_recipe 'redis2'

redis_instance 'cbecc_com_queue'

# docker
include_recipe 'docker' # need to make sure that we upgrade

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
