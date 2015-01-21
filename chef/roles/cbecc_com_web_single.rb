name "cbecc_com_web_single"
description "Install and configure cbecc_com_web on a single machine"

run_list([
             "recipe[cbecc_com_web::base]",
             "recipe[ntp]",
             "recipe[vim]",
             "recipe[nginx]",
             "recipe[mongodb]",
             "recipe[cbecc_com_web::sudo]",
             "recipe[cbecc_com_web::ruby]",
             "recipe[cbecc_com_web::web]",
             "recipe[cbecc_com_web::run_simulations]",

         ])

override_attributes(
    java: {
        jdk_version: '7'
    },
    nginx: {
        default_site_enabled: false
    }
)