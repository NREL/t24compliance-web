#
# Author:: Nicholas Long (<nicholas.long@.nrel.gov>)
# Cookbook Name:: cbecc_com_web
# Recipe:: ruby
#
# Installs Ruby
include_recipe "java"

include_recipe "rbenv"
include_recipe "rbenv::ruby_build"

# Set env variables as they are needed for openstudio linking to ruby
ENV['RUBY_CONFIGURE_OPTS'] = '--enable-shared'
ENV['CONFIGURE_OPTS'] = '--disable-install-doc'

# Install plain ruby 2.0
rbenv_ruby '2.0.0-p576'

# Install JRuby (which is used to run the application)
rbenv_ruby node[:cbecc_com_web][:ruby][:version] do
  global true
end

%w(bundler).each do |g|
  rbenv_gem g do
    ruby_version node[:cbecc_com_web][:ruby][:version]
  end
end
