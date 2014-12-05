source 'https://rubygems.org'


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.1.7'
# Use jdbcsqlite3 as the database for Active Record
# gem 'activerecord-jdbcsqlite3-adapter'
# MongoDB Adapter ( ~> 4.0)
gem 'mongoid', git: 'git://github.com/mongoid/mongoid.git'


# JSON parsing and conversion
gem 'multi_json'
gem 'nokogiri'

# user auth
gem 'devise', '~> 3.4.1'
gem 'cancancan', '~> 1.9'
gem 'role_model'

# Use SCSS for stylesheets
gem 'sass-rails', '~> 4.0.3'
gem 'bootstrap-sass', '~> 3.3.0'
gem 'autoprefixer-rails'
gem 'bootstrap_form'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .js.coffee assets and views
gem 'coffee-rails', '~> 4.0.0'
# See https://github.com/sstephenson/execjs#readme for more supported runtimes
gem 'therubyrhino'
# Use jquery as the JavaScript library
gem 'jquery-rails'
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
# remove turbolinks when using angular
# gem 'turbolinks'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
gem 'bower-rails'

gem 'angular-rails-templates'

# For simulation of CBECC-Com Files
gem 'docker-api', require: 'docker'
gem 'sidekiq'

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# use puma to run the web app in jruby
gem 'puma'

group :doc do
  # bundle exec rake doc:rails generates the API under doc/api.
  gem 'sdoc', require: false
end

group :development do
  # Use Capistrano for deployment
  gem 'capistrano-rbenv'
  gem 'capistrano-rails'
  gem 'capistrano3-puma'
  gem 'capistrano3-nginx'
  gem 'capistrano-file-permissions'
end

gem 'faker'

group :test, :development do
  gem 'rspec', '~> 3.1.0'
  gem 'rspec-rails', '~> 3.1.0'
  #gem 'factory_girl_rails', '~> 4.5'
  gem 'capybara'
  gem 'database_cleaner'
  gem 'selenium-webdriver'
  gem 'teaspoon'
  gem 'phantomjs'
  gem 'rubocop', require: false
  gem 'rubocop-checkstyle_formatter', require: false
end

