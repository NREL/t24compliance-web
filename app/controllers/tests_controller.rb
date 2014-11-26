class TestsController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def index

  	@tests = []

 		if params[:keywords]
      @tests = Test.where(name: /#{params[:keywords]}/i)
		end

  end

  def show
    @test = Test.find(params[:id])
  end

  def create
    @test = Test.new(params.require(:test).permit(:name,:zip_code))
    @test.save
    render 'show', status: 201
  end

  def update
    test = Test.find(params[:id])
    test.update_attributes(params.require(:test).permit(:name,:zip_code))
    head :no_content
  end

  def destroy
    test = Test.find(params[:id])
    test.destroy
    head :no_content
  end

end