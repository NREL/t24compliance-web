#!/bin/bash
export PATH=/opt/rbenv/shims:/opt/rbenv/bin:$PATH;
cd /var/www/cbecc-com-web/current && bundle exec sidekiq -e staging -C /var/www/cbecc-com-web/current/config/sidekiq.yml