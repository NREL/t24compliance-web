class TestController < ApplicationController

  def test

  	@projects = []

 		if params[:keywords]
      @projects = Project.where(name: /#{params[:keywords]}/i)
		end

  end

end