SELECT vehicles.id, vehicles.make, vehicles.model, vehicles.year, vehicles.owner_id
FROM vehicles
JOIN users ON vehicles.owner_id = users.id
WHERE users.name LIKE $1
