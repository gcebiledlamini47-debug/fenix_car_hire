-- Seed vehicles table with initial data
INSERT INTO vehicles (name, category, price_per_day, image, seats, transmission, fuel_type, features, description, is_booked)
VALUES 
  ('Toyota Corolla', 'sedan', 450, '/cars/corolla.png', 5, 'Automatic', 'Petrol', ARRAY['Air Conditioning', 'Bluetooth', 'USB Port'], 'Reliable and fuel-efficient sedan perfect for city driving.', false),
  ('Honda Fit', 'hatchback', 380, '/cars/fit.png', 5, 'Automatic', 'Petrol', ARRAY['Air Conditioning', 'Bluetooth'], 'Compact hatchback with excellent fuel economy.', false),
  ('Suzuki Swift', 'hatchback', 350, '/cars/swift.png', 5, 'Manual', 'Petrol', ARRAY['Air Conditioning', 'Radio'], 'Sporty and economical hatchback.', false),
  ('Toyota Hilux', 'suv', 650, '/cars/hilux.png', 5, 'Automatic', 'Diesel', ARRAY['Air Conditioning', '4x4', 'Bluetooth'], 'Rugged pickup truck for all terrains.', false),
  ('Ford Ranger', 'suv', 700, '/cars/ranger.png', 5, 'Automatic', 'Diesel', ARRAY['Air Conditioning', '4x4', 'Cruise Control'], 'Powerful pickup with modern features.', false),
  ('Toyota Fortuner', 'suv', 850, '/cars/fortuner.png', 7, 'Automatic', 'Diesel', ARRAY['Air Conditioning', '4x4', 'Leather Seats', '7 Seater'], 'Premium 7-seater SUV for family trips.', false),
  ('Mercedes C-Class', 'luxury', 1200, '/cars/mercedes-c.png', 5, 'Automatic', 'Petrol', ARRAY['Air Conditioning', 'Leather Seats', 'Navigation', 'Premium Sound'], 'Luxury sedan with premium features.', false),
  ('BMW 3 Series', 'luxury', 1150, '/cars/bmw-3.png', 5, 'Automatic', 'Petrol', ARRAY['Air Conditioning', 'Leather Seats', 'Navigation', 'Sport Mode'], 'Dynamic luxury sedan with sporty handling.', false),
  ('Toyota Quantum', 'van', 950, '/cars/quantum.png', 14, 'Manual', 'Diesel', ARRAY['Air Conditioning', '14 Seater'], 'Large passenger van for group travel.', false),
  ('Hyundai H1', 'van', 900, '/cars/h1.png', 9, 'Automatic', 'Diesel', ARRAY['Air Conditioning', '9 Seater', 'Bluetooth'], 'Comfortable 9-seater van for families.', false),
  ('Volkswagen Polo', 'hatchback', 400, '/cars/polo.png', 5, 'Automatic', 'Petrol', ARRAY['Air Conditioning', 'Bluetooth', 'USB Port'], 'Stylish and efficient German hatchback.', false),
  ('Nissan NP200', 'suv', 500, '/cars/np200.png', 2, 'Manual', 'Petrol', ARRAY['Radio'], 'Affordable utility vehicle for light loads.', false)
ON CONFLICT DO NOTHING;
