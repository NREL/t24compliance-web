json.array!(@interior_lighting_systems) do |interior_lighting_system|
  json.extract! interior_lighting_system, :id, :name, :status, :parent_space_function, :power_regulated, :non_regulated_exclusion, :luminaire_reference, :luminaire_count, :area_category_allowance_type, :allowance_length, :allowance_area, :tailored_method_allowance_type, :power_adjustment_factor_credit_type, :luminaire_mounting_height, :work_plane_height, :daylit_area_type
end
