# CBECC-Com Web Application

## Description

The CBECC-Com web app runs on JRuby and Rails 4.

## Install

1. Install [rbenv](https://github.com/sstephenson/rbenv) and [ruby-build](https://github.com/sstephenson/ruby-build)
1. rbenv install jruby-1.7.15
1. If you don't have java installed on your machine already, install the Java Development Kit (JDK 7)
1. Install mongo or `brew install mongodb` (not necessary if you will use remote Mongo server instead of restoring full dump locally).
1. If you are going to run cbecc-com simulations, then install redis `brew install redis`
    * Start the redis server `redis-server /usr/local/etc/redis.conf`
1. Install node and bower to manage front end assets. Good article on angular/rails integration [here](http://angular-rails.com/bootstrap.html#an-empty-rails-app).
    * `brew install node`
    * `npm install -g bower`
1. Clone this repository
1. Set your local folder to use jruby `rbenv local jruby-1.7.15` or the system `rbenv global jruby-1.7.15` (not recommended for local development)
1. Install bundler for jruby `gem install bundler`
1. bundle

## Updating Libraries

CBECC-Com Web uses Bower to manage front end assets. To add a new dependency:

* Add the dependency to the Bowerfile
    * Restrict the version if needed
* Run `rake bower:update`
* Commit the updated vendor asset files

## Running

### CBECC-Com Simulations

To run the web application only, then you can simply start mongo (`mongod`) and then rails (`rails s`). * Note that rails run in JRuby with Puma *
The CBECC-Com simulations require the following

* [boot2docker](https://github.com/boot2docker/boot2docker)
* redis (`brew install redis`)
* sidekiq (`bundle exec sidekiq`)

## System Configuration (Using Chef)

* Update the roles/cookbooks in the /chef folder.
* If adding a new cookbook either add it to the Berksfile or as part of the metadata under the cbec_com_web cookbook
* Test locally using Vagrant

  ```
  vagrant up
  cap vagrant deploy
  ```
* Upload the cookbooks and roles to the NREL Chef server

  ```
  berks upload
  # you may need to force the cbecc_com_web unless you incremented the version
  berks upload cbec_com_web --force
  knife role from file chef/roles/cbecc_com_web_single.rb
  ```

* Log into the server and run `sudo chef-client`

## Deployment

### Vagrant / Staging
*Note the use of `bundle exec` to protect against loading wrong gem dependencies*

* Start the vagrant machine and make sure provision runs
* [Vagrant Only] Log into the machine and manually make selinux permissive

```
vagrant ssh
sudo setenforce 0
```

* Deploy the application

  ```
  bundle exec cap vagrant deploy
  # or
  bundle exec cap staging deploy
  ```

* Configure and restart nginx (if you changed the site config)

  ```
  bundle exec cap vagrant nginx:site:add
  bundle exec cap vagrant nginx:site:enable
  bundle exec cap vagrant nginx:reload
  bundle exec cap vagrant nginx:restart
  # or
  bundle exec cap staging nginx:restart
  ```
  
