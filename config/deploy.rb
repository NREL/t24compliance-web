# config valid only for Capistrano 3.1
lock '3.4.0'

# Change these
set :repo_url, 'git@github.com:NREL/cbecc-com-web.git'
set :application, 'cbecc-com-web'
set :puma_threads, [4, 16]
set :puma_workers, 0

# Don't change these unless you know what you're doing
set :pty, true
set :group, 'deploy'
set :use_sudo, false
set :stages, [:vagrant, :staging, :development, :production]
set :deploy_via, :remote_cache
set :deploy_to, "/var/www/#{fetch(:application)}"
set :ssh_options, forward_agent: true, user: fetch(:user), keys: %w(~/.ssh/id_rsa.pub)
# set the tmp directory by user so users can deploy. Not sure if this works on windows (sorry)

# If you want to be able to connect to web server via puma (not nginx),
# then use tcp. unix socket is faster (10%-ish) and preferred
set :puma_bind, 'tcp://127.0.0.1:9292'
# set :puma_bind, "unix://#{shared_path}/tmp/sockets/#{fetch(:application)}-puma.sock"
set :puma_state, "#{shared_path}/tmp/pids/puma.state"
set :puma_pid, "#{shared_path}/tmp/pids/puma.pid"
set :puma_access_log, "#{release_path}/log/puma.error.log"
set :puma_error_log, "#{release_path}/log/puma.access.log"
set :puma_init_active_record, false # Change to true if using ActiveRecord

set :nginx_template, 'config/deploy/templates/nginx_conf.erb'
set :nginx_config_name, fetch(:application)
# turn off sudo for nginx. later on it may be needed for some of the methods
# https://github.com/platanus/capistrano3-nginx/blob/master/lib/capistrano/tasks/nginx.rake
# set :nginx_sudo_paths, []
# set :nginx_sudo_tasks, []

## Defaults:
# set :scm,           :git
# set :branch,        :master

set :log_level,     :debug
set :keep_releases, 50

## Linked Files & Directories (Default None):
# set :linked_files, %w{config/database.yml}
set :linked_dirs,  %w(bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system)

namespace :puma do
  desc 'Create Directories for Puma Pids and Socket'
  task :make_dirs do
    on roles(:app) do
      # Make sure that these are assigned the deploy group write permission

      execute "mkdir #{shared_path}/tmp/sockets -p"
      execute "mkdir #{shared_path}/tmp/pids -p"
      execute "mkdir #{shared_path}/log -p"

      set :file_permissions_paths, ["#{shared_path}/log", "#{shared_path}/tmp/pids", "#{shared_path}/tmp/sockets"]
      # set :file_permissions_users, ["www-data"]
      set :file_permissions_groups, ['deploy']
      set :file_permissions_chmod_mode, '0664'
    end
  end
  before :start, :make_dirs
end

namespace :deploy do
  desc 'Make sure local git is in sync with remote.'
  task :check_revision do
    on roles(:app) do
      unless `git rev-parse HEAD` == `git rev-parse origin/master`
        puts 'WARNING: HEAD is not the same as origin/master. Will deploy code on Github'
        puts 'WARNING: Run `git push` to sync changes.'
      end
    end
  end

  desc 'Initial Deploy'
  task :initial do
    on roles(:app) do
      before 'deploy:restart', 'puma:start'
      invoke 'deploy'
    end
  end

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      invoke 'puma:restart'
    end
  end

  before :starting, :check_revision
  after :finishing, :compile_assets
  after :finishing, :cleanup
  after :finishing, :restart
end
