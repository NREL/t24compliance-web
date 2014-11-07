name "cbecc_com_web_single"
description "Install and configure cbecc_com_web on a single machine"

run_list([
             "recipe[ntp]",
             "recipe[ack]",
             "recipe[vim]",
             "recipe[nginx]",
             "recipe[mongodb]",
             "recipe[cbecc_com_web::sudo]",
             "recipe[cbecc_com_web::ruby]",
         ])


default_attributes(
    :java => {
        :jdk_version => '7'
    }
)
