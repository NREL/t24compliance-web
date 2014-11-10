class InputsController < ApplicationController

	def dashboard

	end

	def index
		@inputs = Input.all.order_by(:name.asc)

    respond_to do |format|
      format.json do
        render :json => @inputs.as_json
      end
      format.html
    end
	end

	def show
		@input = Input.find(params[:id])
		respond_to do |format|
	    format.json do
	      render :json => @input.as_json
	    end
	    format.html
	  end
	end

	def datafields
	
		@input = Input.find(params[:input_id])

		# save changes
		if request.post?

			@input.data_fields.each do |df|
				# save added fields
				if params[:exposed_fields] and params[:exposed_fields].include? df['name']
					df['exposed'] = true
				else
					df['exposed'] = false 
				end

				if params[:set_as_constant_fields] and params[:set_as_constant_fields].include? df['name']
					df['set_as_constant'] = true
				else
					df['set_as_constant'] = false
				end

				df['constant_value'] = params[df['name'] + '_constant']
				df['comments'] = params[df['name'] + '_comments']

			end
			@input.save!
		end


		respond_to do |format|
	    format.html
	  end

	end
end
