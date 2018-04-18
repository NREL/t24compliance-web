source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.1.10'
gem 'mongoid', git: 'git://github.com/mongoid/mongoid.git', ref: '26f67146a7b7969a16862fa'  # MongoDB Adapter ( ~> 4.0)

# JSON parsing and conversion
gem 'multi_json', '1.11.0'
gem 'nokogiri', '1.6.6.2'

# user auth
gem 'devise', '~> 3.4.1'
gem 'cancancan', '1.10.1'
gem 'role_model', '0.8.2'

# Use SCSS for stylesheets
gem 'sass-rails', '~> 4.0.3'
gem 'bootstrap-sass', '~> 3.3.0'
gem 'autoprefixer-rails', '5.2.0'
gem 'bootstrap_form', '2.3.0'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .js.coffee assets and views
gem 'coffee-rails', '~> 4.1.0'
# See https://github.com/sstephenson/execjs#readme for more supported runtimes
gem 'therubyrhino', '2.0.4'
# Use jquery as the JavaScript library
gem 'jquery-rails', '3.1.2'
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
# remove turbolinks when using angular
# gem 'turbolinks'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
gem 'bower-rails', '0.9.2'

# Don't update this beyond 0.1.3 for Windows compatibility (broken up to and including v0.2.0)
gem 'angular-rails-templates', '=0.1.3'

gem 'font-awesome-rails', '4.3.0'

# For simulation of CBECC-Com Files
gem 'docker-api', '1.21.4', require: 'docker'
gem 'file-tail', '1.1.0'
gem 'sidekiq', '3.3.4'
gem 'sidekiq-status', '0.5.3'
gem 'sinatra', '>= 1.3.0', require: nil

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# use puma to run the web app in jruby
platforms :jruby do
  gem 'puma', '2.11.3'
end

# for windows
gem 'tzinfo-data', '1.2015.4'

group :doc do
  # bundle exec rake doc:rails generates the API under doc/api.
  gem 'sdoc', '0.4.1', require: false
end

group :development do
  gem 'better_errors', '~> 1.1.0'

  # Use Capistrano for deployment
  gem 'capistrano', '3.4.0'
  gem 'capistrano-bundler', '1.1.4'
  gem 'capistrano-rbenv', '2.0.3'
  gem 'capistrano-rails', '1.1.3'
  gem 'capistrano3-puma', '1.0.0'
  gem 'capistrano3-nginx', '2.1.1'
  gem 'capistrano-file-permissions', '0.1.1'
end

group :test, :development do
  gem 'faker', '1.4.3'
  gem 'rspec', '~> 3.1.0'
  gem 'rspec-rails', '~> 3.1.0'
  # gem 'factory_girl_rails', '~> 4.5'
  gem 'capybara', '2.4.4'
  gem 'database_cleaner', '1.4.1'
  gem 'selenium-webdriver', '2.45.0'
  gem 'teaspoon', '1.0.2'
  gem 'teaspoon-jasmine', '2.2.0'
  gem 'phantomjs', '1.9.8'
  gem 'rubocop', '0.31.0', require: false
  gem 'rubocop-checkstyle_formatter', '0.2.0', require: false
end
