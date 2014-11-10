# CBECC-Com Web Application

## Description

The CBECC-Com web app runs on JRuby and Rails 4.

## Install

1. Install rbenv (https://github.com/sstephenson/rbenv) and ruby-build (https://github.com/sstephenson/ruby-build)
1. rbenv install jruby-1.7.15
1. If you don't have java installed on your machine already, install the Java Development Kit (JDK 7)
1. Install mongo or `brew install mongodb` (not necessary if you will use remote Mongo server instead of restoring full dump locally).
1. Clone this repository
1. Set your local folder to use jruby `rbenv local jruby-1.7.15` or the system `rbenv global jruby-1.7.15` (not recommended for local development)
1. Install bundler for jruby `gem install bundler`
1. bundle

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

### Vagrant

* Start the vagrant machine and make sure provision runs
* Configure nginx and puma

```
cap vagrant puma:make_dirs
cap vagrant puma:config
cap vagrant puma:nginx_config

cap vagrant deploy
```
