-- Update vehicle images to use specific generated images
UPDATE vehicles SET image = '/images/cars/toyota-corolla.jpg' WHERE name ILIKE '%corolla%';
UPDATE vehicles SET image = '/images/cars/honda-fit.jpg' WHERE name ILIKE '%fit%';
UPDATE vehicles SET image = '/images/cars/suzuki-swift.jpg' WHERE name ILIKE '%swift%';
UPDATE vehicles SET image = '/images/cars/toyota-hilux.jpg' WHERE name ILIKE '%hilux%';
UPDATE vehicles SET image = '/images/cars/ford-ranger.jpg' WHERE name ILIKE '%ranger%';
UPDATE vehicles SET image = '/images/cars/toyota-fortuner.jpg' WHERE name ILIKE '%fortuner%';
UPDATE vehicles SET image = '/images/cars/mercedes-c-class.jpg' WHERE name ILIKE '%mercedes%';
UPDATE vehicles SET image = '/images/cars/bmw-3-series.jpg' WHERE name ILIKE '%bmw%';
UPDATE vehicles SET image = '/images/cars/toyota-quantum.jpg' WHERE name ILIKE '%quantum%';
UPDATE vehicles SET image = '/images/cars/hyundai-h1.jpg' WHERE name ILIKE '%h1%';
UPDATE vehicles SET image = '/images/cars/volkswagen-polo.jpg' WHERE name ILIKE '%polo%';
UPDATE vehicles SET image = '/images/cars/nissan-np200.jpg' WHERE name ILIKE '%np200%';
