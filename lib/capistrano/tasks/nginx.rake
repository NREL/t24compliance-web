# Updated task from the original (https://github.com/seuros/capistrano-puma/blob/master/lib/capistrano/tasks/nginx.cap)
# This version does not use sudo to move the conf files. The chef scripts ensures
# that the nginx directory's group is set to deploy
namespace :puma do
  desc 'Setup nginx configuration'
  task :nginx_config_no_sudo do
    on roles(fetch(:puma_nginx, :web)) do |role|
      template_puma('nginx_conf', "#{fetch(:tmp_dir)}/nginx_#{fetch(:nginx_config_name)}", role)
      execute :mv, "#{fetch(:tmp_dir)}/nginx_#{fetch(:nginx_config_name)} #{fetch(:nginx_sites_available_path)}/#{fetch(:nginx_config_name)}"
      execute :ln, '-fs', "#{fetch(:nginx_sites_available_path)}/#{fetch(:nginx_config_name)} #{fetch(:nginx_sites_enabled_path)}/#{fetch(:nginx_config_name)}"
    end
  end
end
