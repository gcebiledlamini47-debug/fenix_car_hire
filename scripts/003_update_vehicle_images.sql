-- Update vehicle images to use existing images in public folder
UPDATE vehicles SET image = '/images/cars/economy-car.jpg' WHERE category = 'sedan' OR name ILIKE '%corolla%';
UPDATE vehicles SET image = '/images/cars/midsize-car.jpg' WHERE category = 'hatchback' OR name ILIKE '%fit%' OR name ILIKE '%swift%' OR name ILIKE '%polo%';
UPDATE vehicles SET image = '/images/cars/suv.jpg' WHERE category = 'suv' OR name ILIKE '%hilux%' OR name ILIKE '%ranger%' OR name ILIKE '%fortuner%' OR name ILIKE '%np200%';
UPDATE vehicles SET image = '/images/cars/luxury-car.jpg' WHERE category = 'luxury' OR name ILIKE '%mercedes%' OR name ILIKE '%bmw%';
UPDATE vehicles SET image = '/images/cars/van.jpg' WHERE category = 'van' OR name ILIKE '%quantum%' OR name ILIKE '%h1%';
