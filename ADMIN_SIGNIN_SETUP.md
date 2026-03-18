# Admin Dashboard Sign-In Setup

## Status: READY TO USE

The admin dashboard is now fully configured and ready for sign-in.

### Access Points
- **Login URL**: `/admin/login`
- **Dashboard URL**: `/admin/dash` (redirects to login if not authenticated)

### Demo Credentials
- **Email**: `admin@fenix.co.sz`
- **Password**: `admin123`

### How Sign-In Works

1. **Login Form** (`/app/admin/login/page.tsx`)
   - User enters email and password
   - Form submits to `/api/admin/login` API route

2. **Authentication API** (`/app/api/admin/login/route.ts`)
   - Validates credentials against Supabase `admin_users` table
   - Returns token if credentials are valid
   - Token is stored in localStorage and as an HTTP-only cookie

3. **Dashboard Layout** (`/app/admin/layout.tsx`)
   - Checks for token in localStorage and cookies on mount
   - Auto-redirects to login if no token found
   - Displays sidebar navigation with links to all admin modules

4. **Token Storage**
   - **localStorage**: For client-side persistence across page reloads
   - **HTTP-only Cookie**: For secure server-side session validation
   - Both are cleared on logout

### Admin Modules Available
- Dashboard: Real-time stats from database
- Bookings: Manage customer bookings
- Quotations: Create and edit quotations
- Invoices: Generate tax invoices
- Checksheets: Vehicle inspection forms
- Messages: Contact form submissions

### Recent Fixes
- Removed deprecated `swcMinify` from next.config.ts
- Fixed viewport metadata export in root layout.tsx
- Confirmed duplicate pages have been removed
- Token handling implemented for both localStorage and cookies

### To Test
1. Navigate to `/admin/login`
2. Enter credentials: `admin@fenix.co.sz` / `admin123`
3. Click Sign In
4. You'll be redirected to `/admin/dash` with full access to admin modules
