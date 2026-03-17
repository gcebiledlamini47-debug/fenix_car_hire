# Admin Dashboard Access Guide

## Quick Start - How to Access Your Admin Dashboard

### Step 1: Navigate to Admin Login
Open your browser and go to:
```
http://localhost:3000/admin/login
```

Or if deployed on Vercel:
```
https://your-domain.vercel.app/admin/login
```

### Step 2: Login with Default Credentials
- **Email:** `admin@fenix.co.sz`
- **Password:** `admin123`

### Step 3: You're In!
Once logged in, you'll see the main admin dashboard with access to:

## Admin Dashboard Modules

### 1. **Dashboard** 📊
- Overview of all statistics
- Recent bookings
- Quick links to all modules

### 2. **Bookings** 📅
- View all customer booking requests
- Update booking status (Pending → Confirmed → Completed → Cancelled)
- Click on any booking to view details
- Create quotations and checksheets from bookings

### 3. **Quotations** 📋
- Create new quotations from customer bookings
- Edit existing quotations
- View quotation history
- Calculate totals with VAT automatically

**Quotation includes:**
- Customer name and contact details
- Vehicle information
- Daily rate and number of days
- Excess km charges
- Km allowance per day
- VAT (15%) calculation
- Banking details for payment

### 4. **Checksheets** ✓
- Pre-rental vehicle inspection forms
- Post-rental vehicle inspection forms
- Document vehicle condition
- Track fuel, mileage, and damage

**Checksheet includes:**
- Vehicle images (front, back, sides)
- Fuel level
- Current mileage
- Tire condition
- Exterior and interior condition
- Damage notes
- Inspector signature

### 5. **Invoices** 📄
- Create tax invoices for customers
- Track payment status
- View invoice history
- Print invoices

**Invoice includes:**
- Line items (rental, insurance, excess charges)
- Daily rate calculation
- Subtotal
- VAT (15%) calculation
- Total amount
- Banking details
- Payment status

### 6. **Messages** 💬
- View all customer contact form submissions
- View booking inquiries
- Mark messages as read/unread
- Quick customer contact links (phone, email)

## Managing Records

### Creating a New Document
1. Navigate to the module (Quotations, Invoices, Checksheets)
2. Click "Create New" button
3. Fill in the required information
4. Click "Save"

### Editing Existing Documents
1. Find the document in the list
2. Click "Edit" button
3. Make your changes
4. Click "Update"

### Viewing Details
- Click on any record to view full details
- Use the "Edit" button to make changes
- Use the "Delete" button to remove records

## Form Submissions

When customers submit:
- **Contact Form** → Appears in Messages section
- **Booking Form** → Appears in Bookings section

You'll receive real-time notifications for all new submissions!

## Important Notes

⚠️ **Default Password:** Please change the default password after your first login by updating the admin_users table in Supabase.

🔒 **Security:** The admin panel is protected by authentication middleware. Only authenticated admins can access these pages.

📱 **Responsive:** The admin dashboard works on desktop and tablet devices.

## Troubleshooting

**Can't see the admin page?**
- Make sure you're using the correct URL: `/admin/login`
- Clear your browser cache and try again
- Check that Supabase is connected in project settings

**Login not working?**
- Verify email: `admin@fenix.co.sz`
- Verify password: `admin123`
- Check browser console (F12) for any error messages

**Data not showing?**
- Refresh the page
- Check that the Supabase connection is active
- Verify that customer submissions have been made

## Contact & Support

For additional help or to customize the admin dashboard, refer to the ADMIN_DASHBOARD.md file or contact your development team.
