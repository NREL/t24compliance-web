require 'spec_helper'

describe SimulationsController do
  render_views
  describe "index" do
    before do
      Simulation.create!(name: 'test 1')
      Simulation.create!(name: 'test 2')
      Simulation.create!(name: 'another test')
      Simulation.create!(name: 'hmmm')

      xhr :get, :index, format: :json, keywords: keywords
    end

    subject(:results) { JSON.parse(response.body) }

    def extract_name
      ->(object) { object["name"] }
    end

    context "when the search finds results" do
      let(:keywords) { 'baked' }
      it 'should 200' do
        expect(response.status).to eq(200)
      end
      it 'should return two results' do
        expect(results.size).to eq(2)
      end
      it "should include 'test 2'" do
        expect(results.map(&extract_name)).to include('test 2')
      end
      it "should include 'another test'" do
        expect(results.map(&extract_name)).to include('another test')
      end
    end

    context "when the search doesn't find results" do
      let(:keywords) { 'foo' }
      it 'should return no results' do
        expect(results.size).to eq(0)
      end
    end

  end
end