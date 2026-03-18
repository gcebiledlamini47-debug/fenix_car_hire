-- Ensure admin user exists with plaintext password for demo purposes
-- In production, this should be properly hashed with bcrypt

DELETE FROM admin_users WHERE email = 'admin@fenix.co.sz';

INSERT INTO admin_users (email, password_hash, is_admin, created_at)
VALUES (
  'admin@fenix.co.sz',
  'admin123',
  true,
  NOW()
);

SELECT * FROM admin_users WHERE email = 'admin@fenix.co.sz';
