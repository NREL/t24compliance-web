Rails.application.routes.draw do

  resources :projects

  resources :inputs, :only => [:index] do
    get 'datafields'
    match 'datafields' => 'inputs#datafields', :via => [:get, :post]
  end

  root :to => "inputs#dashboard"
end
