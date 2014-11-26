name              "cbecc_com_web"
maintainer        "NREL"
maintainer_email  "nicholas.long@nrel.gov"
license           "LGPL"
description       "Install and configure app for CBECC-Com Web"
long_description  IO.read(File.join(File.dirname(__FILE__), 'README.md'))
version           "0.0.2"

depends 'yum'
depends 'sudo'
depends 'java'
depends 'nginx'
depends 'application_nginx'
depends 'iptables'
depends 'rbenv', '~> 1.7.1'
depends 'redis2', '~> 0.5.1'
depends 'docker', '~> 0.36.0'
depends 'sidekiq', '~> 3.3.0'

%w{ redhat centos }.each do |os|
  supports os
end

