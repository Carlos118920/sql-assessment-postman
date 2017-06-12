SELECT 
FROM vehicles
JOIN users ON vehicles.owner_id = users.id
WHERE $1 = users.email
