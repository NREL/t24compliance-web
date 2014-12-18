unless @project.construction_default.nil?
  json.extract! @project.construction_default, :id, :external_wall, :internal_wall, :underground_wall, :roof, :window, :skylight, :interior_floor, :exterior_floor, :underground_floor
end
