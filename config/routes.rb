Rails.application.routes.draw do

  resources :simulations do
    member do
      post :run
      get :run
    end
  end

  resources :buildings

  resources :projects

  resources :inputs, :only => [:index, :show] do
    get 'datafields'
    match 'datafields' => 'inputs#datafields', :via => [:get, :post]
  end

  root :to => "inputs#dashboard"
end
