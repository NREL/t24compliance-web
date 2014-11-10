source "https://supermarket.getchef.com"

# This will pull in many of the dependencies
cookbook 'cbecc_com_web', path: "chef/cookbooks/cbecc_com_web"

# Tell where to get some of the dependencies
cookbook 'vim'
cookbook 'ntp'
cookbook 'rbenv'
cookbook 'nginx'

# Not sure if using the github cookbook fixed the issue with mongo install
# but deleting the distro version and reinstalling everything seemed to work.
cookbook 'mongodb' #, github: 'edelight/chef-mongodb'
