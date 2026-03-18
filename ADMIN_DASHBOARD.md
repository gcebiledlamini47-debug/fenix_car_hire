# Admin Dashboard - Fenix Car Hire

## Overview
The Fenix Car Hire Admin Dashboard provides comprehensive management tools for quotations, checksheets, invoices, bookings, and customer messages.

## Admin Access

**Login URL:** `https://yoursite.com/admin/login`

**Default Credentials:**
- Email: `admin@fenix.co.sz`
- Password: `admin123`

⚠️ **IMPORTANT:** Change the default password immediately after first login.

## Dashboard Features

### 1. Dashboard
The main dashboard provides an overview of:
- Recent bookings
- Pending messages
- Quick statistics
- System status

**Access:** `/admin/dashboard`

### 2. Quotations Management
Create and manage quotations for customers.

**Features:**
- Create new quotations
- Edit existing quotations
- View detailed quotation information
- Track quotation status (Draft, Sent, Accepted, Rejected)
- Print/Export quotations

**Fields:**
- Customer name
- Vehicle type and rate
- Rental duration (days)
- Km/day allowance
- Excess charges
- Deposit amount
- Contact information

**Access:** `/admin/quotations`
**Detail/Edit:** `/admin/quotations/[id]`

### 3. Checksheets
Manage vehicle checksheets for pre-rental and post-rental inspections.

**Features:**
- Create new checksheets
- Document vehicle condition
- Track damages and wear
- Generate checksheet reports
- Attach photos/documentation

**Sections:**
- Vehicle Details (Make, Model, Registration, KM)
- Exterior Inspection (Paint, Lights, Tires, Windows)
- Interior Inspection (Seats, Steering, Dashboard, Accessories)
- Fuel & Mileage Details
- Signature & Date

**Access:** `/admin/checksheets`
**Detail/Edit:** `/admin/checksheets/[id]`

### 4. Invoices
Generate and manage customer invoices.

**Features:**
- Create invoices from quotations/bookings
- Track payment status
- Calculate VAT (15%)
- Email invoices to customers
- View payment history

**Invoice Includes:**
- Rental charges
- Km allowance
- Excess charges
- Contract fees
- VAT calculation (15%)
- Bank account details
- Company information

**Access:** `/admin/invoices`
**Detail/Edit:** `/admin/invoices/[id]`

### 5. Bookings Management
View and manage all customer booking requests.

**Features:**
- View all bookings
- Update booking status (Pending, Confirmed, Completed, Cancelled)
- Create quotations from bookings
- Create checksheets from bookings
- Create invoices from bookings
- Contact customer

**Status Tracking:**
- **Pending:** New booking awaiting confirmation
- **Confirmed:** Booking accepted and confirmed
- **Completed:** Rental completed
- **Cancelled:** Booking cancelled

**Access:** `/admin/bookings`
**Detail/Edit:** `/admin/bookings/[id]`

### 6. Messages & Notifications
View all contact form submissions and booking inquiries.

**Features:**
- View all contact messages
- Mark messages as read/unread
- Reply to customers
- Delete/archive messages
- Real-time notifications
- Search and filter messages

**Notification:** Admin receives notifications when:
- New contact message is submitted
- New booking request is received
- Quotation is sent to customer
- Invoice payment is received

**Access:** `/admin/messages`

## Navigation

The admin sidebar provides quick access to all modules:
- Dashboard
- Quotations
- Checksheets
- Invoices
- Bookings
- Messages
- Logout

## Customer Information

**Company Name:** Fenix Car Hire
**Email:** reception@fenix.co.sz
**Phone:** +268 76829797
**Address:** Mbabane, Sidvwashini, Lilanga Complex, Office B

**Bank Details:**
- Account Name: Semperfi Investments (Pty)
- Bank: Standard Bank Swaziland
- Branch Code: 663164
- Account Number: 9110005689573

## Workflow Examples

### Creating a Quotation from a Booking
1. Go to **Bookings**
2. Click on a pending booking
3. Click **Create Quotation**
4. Fill in vehicle details, rates, and charges
5. Click **Save & Send**
6. Quotation will be saved and customer notified

### Converting Quotation to Invoice
1. Go to **Quotations**
2. Find accepted quotation
3. Click **Create Invoice**
4. Review totals and VAT calculation
5. Click **Send Invoice**
6. Customer receives invoice with payment details

### Vehicle Inspection Workflow
1. Go to **Checksheets**
2. Click **New Checksheet**
3. Select vehicle and date
4. Document condition (Pre-rental)
5. Save and attach to booking
6. After rental, create post-rental checksheet
7. Compare conditions and document changes

## Security

- All admin sessions are protected with authentication
- Changes are logged and timestamped
- Database access is restricted to authorized personnel
- Regular backups are maintained

## Support

For technical issues or questions about the admin dashboard, contact:
**Email:** reception@fenix.co.sz
**Phone:** +268 76829797

## Last Updated
March 17, 2026
