Rails.application.routes.draw do

  root :to => "inputs#dashboard"

  devise_for :users
  resources :users
  get '/admin' => 'users#admin'

  devise_scope :user do
    get '/login' => 'devise/sessions#new'
    get '/logout' => 'devise/sessions#destroy'
  end

  resources :inputs, :only => [:index, :show] do
    get 'datafields'
    match 'datafields' => 'inputs#datafields', :via => [:get, :post]
  end

  get 'wizard' => 'projects#wizard'
  resources :buildings
  resources :projects do
    resources :materials
    resources :construct_assemblies
    resources :simulations do
      member do
        post :run
        get :run
      end
    end
  end

  # libraries
  resources :constructions, only: [:show, :index]
  resources :fenestrations, only: [:show, :index]

  # depend on project
  resources :construction_defaults     # only index, create for angular

  # depend on building
  resources :building_stories do  
    post 'bulk_sync', on: :collection    
  end
  resources :zone_systems do
    post 'bulk_sync', on: :collection
  end




  # non-revised below



  resources :windows

  resources :underground_floors

  resources :holidays

  resources :design_days

  resources :recirculation_water_heaters

  resources :outside_air_controls

  resources :fans

  resources :coil_coolings

  resources :terminal_units

  resources :air_segments

  resources :thermal_zones

  resources :roofs

  resources :ceilings

  resources :recirculation_dhw_systems

  resources :heat_rejections

  resources :evaporative_coolers

  resources :zone_systems

  resources :external_shading_objects

  resources :interior_walls

  resources :exterior_floors

  resources :curve_double_quadratics

  resources :curve_linears

  resources :space_function_defaults

  resources :schedules

  resources :spaces

  resources :pumps

  resources :water_heaters

  resources :boilers

  resources :chillers

  resources :fluid_segments

  resources :fluid_systems

  resources :coil_heatings

  resources :doors

  resources :skylights

  resources :underground_walls

  resources :interior_floors

  resources :exterior_walls

  resources :interior_lighting_systems

  resources :curve_cubics

  resources :curve_quadratics

  resources :luminaires

  resources :door_constructions

  resources :fenestration_constructions

  resources :schedule_weeks

  resources :schedule_days

  resources :air_systems

  resources :cartesian_points

  resources :poly_loops

  require 'sidekiq/web'
  mount Sidekiq::Web => '/sidekiq'






end
