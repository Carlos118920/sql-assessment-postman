SELECT count(*)
FROM vehicles
WHERE $1 = owner_id
