# Task to deploy the sidekiq into the bin directory with the correct rails environment.
# This script does not configure the supervisor task that holds the process. That is configured (currently) via chef
namespace :sidekiq do
  desc 'Setup sidekiq shell script'
  task :config do
    on roles(:app) do
      template_sidekiq "sidekiq.sh.erb", "#{shared_path}/bin/sidekiq.sh", false
      execute :sudo ,:chmod, "+x #{shared_path}/bin/sidekiq.sh"
      #execute :sudo, :mv, "/tmp/puma_upstart /etc/init/#{fetch(:app_env)}.conf"
    end
  end
end

def template_sidekiq(from, to, as_root = false)
  template_path = File.expand_path("../../../../config/deploy/templates/#{from}", __FILE__)
  template = ERB.new(File.new(template_path).read).result(binding)
  upload! StringIO.new(template), to

  execute :sudo, :chmod, "644 #{to}"
  execute :sudo, :chown, "root:root #{to}" if as_root == true
end