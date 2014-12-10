json.array!(@construction_defaults) do |construction_default|
  json.extract! construction_default, :id, :external_wall, :internal_wall, :roof, :window, :skylight, :raised_floor, :slab_on_grade
end
