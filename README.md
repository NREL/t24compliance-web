# CBECC-Com Web Application

## Description

The CBECC-Com web app runs on JRuby and Rails 4.

## Deployment

### Vagrant / Staging

*Note the use of `bundle exec` to protect against loading wrong gem dependencies*

* Start the vagrant machine and make sure provision runs to completion
* Deploy the application by calling the command below. *Note that on initial deployment that this will take awhile (minutes) to deploy.*

  ```
  bundle exec cap vagrant deploy
  # or
  bundle exec cap staging deploy
  ```

* Configure and restart nginx (or if you changed the site config). *Note that this should be a deploy:cold task someday*

  ```
  bundle exec cap vagrant deploy:seed
  bundle exec cap vagrant nginx:site:add
  bundle exec cap vagrant nginx:site:enable
  bundle exec cap vagrant nginx:reload
  bundle exec cap vagrant nginx:restart
  # or
  bundle exec cap staging deploy:seed
  bundle exec cap staging nginx:site:add
  bundle exec cap staging nginx:site:enable
  bundle exec cap staging nginx:reload
  bundle exec cap staging nginx:restart
  ```

One liner (for vagrant)
  `bundle exec cap vagrant nginx:site:add && bundle exec cap vagrant nginx:site:enable && bundle exec cap vagrant nginx:reload && bundle exec cap vagrant nginx:restart`

* After deployment you may want to import some test projects into the test@nrel.gov:password user

    ```
    # ssh into machine
    vagrant ssh
    cd /var/www/cbecc-com-web
    bundle exec rake sim:import_test_project RAILS_ENV=vagrant
    ```

### AWS Production via Chef / Knife / Capistrano

* Update the roles/cookbooks in the `chef/cookbooks, chef/roles` folder.
* If adding a new cookbook either add it to the Berksfile or as part of the metadata under the cbec_com_web cookbook
* Test locally using Vagrant per instruction above
* Upload the cookbooks and roles to the Hosted Chef server

```
berks upload
# you may need to force the cbecc_com_web unless you incremented the version
berks upload cbec_com_web --force
knife role from file chef/roles/cbecc_com_web_single.rb
 ```

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

* After initial deploy change the default password for test@nrel.gov from password to something more secure
*

#### Worker Nodes

The worker nodes use Sidekiq as the asynchronous task manager. To config Sidekiq for the first time call

 ```
 cap vagrant sidekiq:config
 cap staging sidekiq:config
 cap production sidekiq:config
 ```

Then log into the supervisor client `ip_address:8080` and click start on the task.

Currently the worker is the same as the server; however, this does not need to be the case. To start a worker on the server run the following in the background. The entire checkout of the application needs to be on the worker as well and the IP address of redis needs to be configured in the sidekiq.yml file.

```
cd /var/www/cbecc-com-web/current/
bundle exec sidekiq -e production
```

# Known Limitations / Issues

* Current timeout of 1 hour for simulations
* One must manually stop and restart the Sidekiq process (held by supervisor) on deploy. `ip_address:8080`
* Deployment is assumed to be on a single server. The application should work with separate worker nodes, but the Chef recipes will need to be modified.
* Simulation results are stored in /data/simulations/#{environment}/{sim_id}. These results will eventually fill up the machine since most results are being persisted.
* ~~System email may not be working~~
* If you restart IP tables, you must restart the docker service, else the docker container will not have internet access
* There is no password on mongodb (make sure ports/iptables are configured correctly)
* Need to cleanup repo before opening up
    * Remove secret_key

# Development Setup

## Instructions

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

## Running CBECC-Com Simulations

To run the web application only, then start the following:
* mongodb (`mongod`)
* Run rails (`rails s`) * Note that rails run in JRuby with Puma *

To run the CBECC-Com simulations, then start the following:

* [boot2docker](https://github.com/boot2docker/boot2docker) then `boot2docker start`. Make sure to export the docker port.
* redis (`brew install redis`) then `redis-server`
* sidekiq (installed with bundler) then `bundle exec sidekiq -e development` or `bundle exec sidekiq -e test`

## Asset Pipeline Hints

* In your Sass file, use 'font-path' to include font libraries.  This may be a problem when importing 3rd-party css into your project (ex: ui-grid)

  ```
  @font-face {
      font-family: 'MyFont';
      src: url(font-path('myfont-webfont.eot') + "?#iefix") format('embedded-opentype'),
           url(font-path('myfont-webfont.woff')) format('woff'),
           url(font-path('myfont-webfont.ttf'))  format('truetype'),
           url(font-path('myfont-webfont.svg') + "#MyFont") format('svg');
  }
  ```

* If you include asset images in the angular .html files, use <image_tag> to include them and add '.erb' to the end of the .html file.

* In config/environments/production.rb, the serve_static_asset config should be set to false:

 ```
  config.serve_static_assets = false
  ```

* Constructions are downloaded and stored in the browser cache. If you need to reset the cache run the following in your web browser's console


    ```
    localStorage.clear()
    ```


