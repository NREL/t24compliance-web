Rails.application.routes.draw do

  resources :inputs, :only => [:index] 

  root :to => "inputs#index"
end
