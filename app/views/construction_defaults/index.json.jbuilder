unless @project.construction_default.nil?
  json.extract! @project.construction_default, :id, :exterior_wall, :interior_wall, :underground_wall, :roof, :door, :window, :skylight, :interior_floor, :exterior_floor, :underground_floor
end
