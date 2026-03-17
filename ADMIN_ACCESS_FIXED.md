# Admin Dashboard - Fixed Access Guide

## Status: FIXED ✅

The admin dashboard now has proper layout separation. The login page displays correctly without inheriting the website layout.

## How to Access the Admin Dashboard

### Step 1: Navigate to Login
Open your browser and go to:
```
/admin/login
```

### Step 2: Login with Demo Credentials
- **Email:** `admin@fenix.co.sz`
- **Password:** `admin123`

### Step 3: Access Admin Features
After logging in, you'll see the admin dashboard with these modules:

#### 📊 Dashboard
- Overview of all business activity
- Recent bookings and messages
- Quick statistics

#### 📅 Bookings Management
- View all customer booking requests
- Update booking status (Pending, Confirmed, Completed, Cancelled)
- Create quotations and checksheets for bookings
- Contact customer directly

#### 📋 Quotations
- Create new quotations for customers
- Edit existing quotations
- Calculate rates, km allowances, and VAT automatically
- Generate professional quotation PDFs

#### ✓ Vehicle Checksheets
- Create vehicle inspection forms
- Document vehicle condition (pre-rental and post-rental)
- Track exterior, interior, fuel level, and mileage
- Add damage notes and comments

#### 📄 Invoices
- Generate tax invoices
- Add line items for rentals, fees, and charges
- Calculate 15% VAT automatically
- Track payment status

#### 💬 Messages
- View all customer contact form submissions
- Mark messages as read/unread
- Reply to customer inquiries
- Organized by date and priority

## Features

✅ **Secure Authentication**
- HTTP-only cookies for session management
- 24-hour session expiry
- Protected routes with automatic redirects

✅ **Real-time Data**
- All data stored in Supabase database
- Auto-synced with website forms
- Instant notifications for new submissions

✅ **Full CRUD Operations**
- Create, read, update, delete documents
- Edit customer information
- Modify quotations, invoices, and checksheets

✅ **Professional Forms**
- Responsive design
- Mobile-friendly interface
- Clean, intuitive navigation

## Technical Details

### Architecture
- **Login Page:** `/admin/login` (public, no auth required)
- **Protected Routes:** `/admin/dashboard`, `/admin/bookings`, etc. (require authentication)
- **Layout Separation:** 
  - Login uses simple login layout
  - Dashboard and other routes use protected layout with sidebar
  - Each route has its own layout file for proper authentication checks

### Database
- Admin users stored in `admin_users` table
- Session tokens stored in HTTP-only cookies
- Customer data in separate tables: bookings, quotations, checksheets, invoices, messages

### Security
- Passwords stored as plain text in demo (use bcrypt in production)
- CSRF protection with secure cookies
- Input validation on all forms
- SQL injection prevention with parameterized queries

## Troubleshooting

### Login Page Not Showing?
- Clear browser cache and cookies
- Try incognito/private mode
- Check that `/admin/login` URL is correct

### Can't Login?
- Verify credentials: `admin@fenix.co.sz` / `admin123`
- Check database admin_users table has the user
- Check browser console for errors

### Session Expires?
- Sessions last 24 hours
- You'll be redirected to login automatically
- Clear cookies if needed and login again

### Forms Not Saving?
- Check Supabase connection status
- Verify database tables exist
- Check browser console for API errors

## Production Checklist

Before deploying to production:

- [ ] Change admin password in database
- [ ] Implement bcrypt password hashing
- [ ] Set `secure: true` for cookies (already done)
- [ ] Enable HTTPS
- [ ] Set up email notifications
- [ ] Backup database regularly
- [ ] Set up activity logging
- [ ] Add rate limiting to login endpoint
- [ ] Implement 2FA authentication
- [ ] Add audit trails for all admin actions

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Check Supabase dashboard for database status
4. Contact support with error details
