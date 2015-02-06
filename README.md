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

CBECC-Com Web uses Bower to manage front end libraries. To add a new dependency:

* Add the dependency to the Bowerfile
    * Restrict the version if needed
* Run `rake bower:install`
* Remove the bootstrap that is installed because it is a dependency of angular-strap
    * `rm -rf vendor/assets/bower_components/bootstrap`
* Commit the updated vendor/asset files

To update the dependencies (based on version restrictions in the Bowerfile):

* Run `rake bower:update`
* Remove the bootstrap that is installed because it is a dependency of angular-strap
    * `rm -rf vendor/assets/bower_components/bootstrap`
* Commit the updated vendor/asset files

## Running

### CBECC-Com Simulations

To run the web application only, then start the following:
* mongodb (`mongd`)
* Run rails (`rails s`) * Note that rails run in JRuby with Puma *

To run the CBECC-Com simulations, then start the following:

* [boot2docker](https://github.com/boot2docker/boot2docker) then `boot2docker start`. Make sure to export the docker port.
* redis (`brew install redis`) then `redis-server`
* sidekiq (installed with bundler) then `bundle exec sidekiq -e development` or `bundle exec sidekiq -e test`

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

* Map t24compliance.net to your vagrant IP in your hosts file


* Start the vagrant machine and make sure provision runs

* Deploy the application

  ```
  bundle exec cap vagrant deploy
  # or
  bundle exec cap staging deploy
  ```

* Configure and restart nginx (or if you changed the site config). Note that this should be a deploy:cold task someday.

  ```
  bundle exec cap vagrant deploy:seed
  bundle exec cap vagrant nginx:site:add
  bundle exec cap vagrant nginx:site:enable
  bundle exec cap vagrant nginx:reload
  bundle exec cap vagrant nginx:restart
  # or
  bundle exec cap staging nginx:restart
  ```

  `bundle exec cap vagrant nginx:site:add && bundle exec cap vagrant nginx:site:enable && bundle exec cap vagrant nginx:reload && bundle exec cap vagrant nginx:restart`
  

### AWS Production via Chef / Knife / Capistrano
   
* Cut the server. Make sure to specify your own *security group*

```
knife ec2 server create -f m3.xlarge --ebs-size 100 -g sg-7f23ed12 -x ec2-user --node-name cbecc_com_web_single -I ami-b66ed3de -Z us-east-1b --ssh-key $AWS_SSH_KEY_ID -A $AWS_ACCESS_KEY -K $AWS_SECRET_KEY
```

* Log into the Chef Server (https://manage.chef.io)
* Add cbecc-com-web-single role to node
* Log into the new server and call chef-client

```
ssh ec2-user@<IP_ADDRESS>
sudo chef-client
```

* You may have to call `chef-client` multiple times until it converges. *MongoDB does not converge until the third call*
* Update the config/deploy/production.rb to include the IP/DNS of the new AWS server
* From local machine, deploy the application

  ```
  bundle exec cap production deploy
  bundle exec cap production deploy:seed
  bundle exec cap production nginx:site:add
  bundle exec cap production nginx:site:enable
  bundle exec cap production nginx:reload
  bundle exec cap production nginx:restart
  ```
