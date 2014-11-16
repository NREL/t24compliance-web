require 'spec_helper.rb'

feature "Looking up simulations", js: true do
  scenario "finding simulations" do
    visit '/'
    fill_in "keywords", with: "baked"
    click_on "Search"

    expect(page).to have_content("another test")
    expect(page).to have_content("test 2")
  end
end