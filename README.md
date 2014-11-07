# CBECC-Com Web Application

## Description

The CBECC-Com web app runs on JRuby and Rails 4.

## Install

1. Install rbenv (https://github.com/sstephenson/rbenv) and ruby-build (https://github.com/sstephenson/ruby-build)
1. rbenv install jruby-1.7.9
1. If you don't have java installed on your machine already, install the Java Development Kit (JDK 7)
1. Install bundler for jruby `jgem install bundler`
1. Install mongo or `brew install mongodb` (not necessary if you will use remote Mongo server instead of restoring full dump locally).
1. clone this repository
1. If using rbenv, set jruby-1.7.9 in cofee-rails directory `rbenv local jruby-1.7.9`
1. bundle


## System Configuration (Using Chef)
