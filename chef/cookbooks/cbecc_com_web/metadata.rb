name              "cbecc_com_web"
maintainer        "NREL"
maintainer_email  "nicholas.long@nrel.gov"
license           "LGPL"
description       "Install and configure app for CBECC-Com Web"
long_description  IO.read(File.join(File.dirname(__FILE__), 'README.md'))
version           "0.0.1"

depends 'rbenv'
depends 'java'
depends 'sudo'

%w{ redhat centos }.each do |os|
  supports os
end
