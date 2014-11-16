json.array!(@heat_rejections) do |heat_rejection|
  json.extract! heat_rejection, :id, :name, :status, :type
  json.url heat_rejection_url(heat_rejection, format: :json)
end
