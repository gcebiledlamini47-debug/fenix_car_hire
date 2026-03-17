-- Create admin user for testing
-- Email: admin@fenix.co.sz
-- Password: admin123

INSERT INTO public.admin_users (id, email, password_hash, is_admin, created_at)
VALUES (
  gen_random_uuid(),
  'admin@fenix.co.sz',
  'admin123',
  true,
  now()
)
ON CONFLICT DO NOTHING;
