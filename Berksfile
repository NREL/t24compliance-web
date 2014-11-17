source "https://supermarket.getchef.com"

# This will pull in many of the dependencies
cookbook 'cbecc_com_web', path: "chef/cookbooks/cbecc_com_web"

# Tell where to get some of the dependencies
cookbook 'vim', '~> 1.1.2'
cookbook 'ntp', '~> 1.6.5'
cookbook 'rbenv', '~> 1.7.1'
cookbook 'nginx', '~> 2.7.4'
cookbook 'docker', '~> 0.36.0'

# Not sure if using the github cookbook fixed the issue with mongo install
# but deleting the distro version and reinstalling everything seemed to work.
cookbook 'mongodb' #, github: 'edelight/chef-mongodb'
