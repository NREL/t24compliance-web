json.array!(@constructions) do |construction|
  json.extract! construction, :id, :name, :slab_type, :slab_insulation_orientation, :slab_insulation_thermal_resistance, :compatible_surface_type, :type, :framing_configuration, :framing_size, :cavity_insulation_r_value, :continuous_insulation_r_value, :continuous_insulation_material_name, :layers
end
