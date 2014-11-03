class InputsController < ApplicationController

	def index
		@inputs = Input.all

    respond_to do |format|
      format.json do
        render :json => @inputs.as_json
      end
      format.html
    end
	end

	def show
		@input = Structure.find(params[:id])
		respond_to do |format|
	    format.json do
	      render :json => @input.as_json
	    end
	    format.html
	  end
	end
end
