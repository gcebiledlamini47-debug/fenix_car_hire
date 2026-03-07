-- Add your admin email to the admin_users table
-- Make sure to create this user in Supabase Auth first (you can do this via the signup process)

INSERT INTO admin_users (email, role)
VALUES ('reception@fenix.co.sz', 'super_admin')
ON CONFLICT (email) DO UPDATE SET role = 'super_admin';
