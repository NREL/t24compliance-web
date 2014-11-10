namespace :code_gen do
  desc "import input fields"
  task :run => :environment do
    `rails g scaffold ExampleModel --no-helper --no-assets --no-test-framework`
  end
end
