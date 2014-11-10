namespace :code_gen do
  desc "import input fields"
  task :run => :environment do
    `rails g scaffold JunkTestToo --no-helper --no-assets --no-test-framework`
  end
end
