-- Create quotations table
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  vehicle_name TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  number_of_days INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  insurance_cost DECIMAL(10,2) DEFAULT 0,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  vehicle_name TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  number_of_days INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  insurance_cost DECIMAL(10,2) DEFAULT 0,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  reference_number TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin messages table for customer responses
CREATE TABLE IF NOT EXISTS admin_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  contact_message_id UUID REFERENCES contact_messages(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  message_type TEXT DEFAULT 'booking',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  response TEXT,
  response_by TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quotations
CREATE POLICY "Allow public read on quotations" ON quotations FOR SELECT USING (true);
CREATE POLICY "Allow admin insert on quotations" ON quotations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin update on quotations" ON quotations FOR UPDATE USING (true);
CREATE POLICY "Allow admin delete on quotations" ON quotations FOR DELETE USING (true);

-- RLS Policies for invoices
CREATE POLICY "Allow public read on invoices" ON invoices FOR SELECT USING (true);
CREATE POLICY "Allow admin insert on invoices" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin update on invoices" ON invoices FOR UPDATE USING (true);
CREATE POLICY "Allow admin delete on invoices" ON invoices FOR DELETE USING (true);

-- RLS Policies for payments
CREATE POLICY "Allow public read on payments" ON payments FOR SELECT USING (true);
CREATE POLICY "Allow admin insert on payments" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin update on payments" ON payments FOR UPDATE USING (true);
CREATE POLICY "Allow admin delete on payments" ON payments FOR DELETE USING (true);

-- RLS Policies for admin_messages
CREATE POLICY "Allow public read on admin_messages" ON admin_messages FOR SELECT USING (true);
CREATE POLICY "Allow admin insert on admin_messages" ON admin_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin update on admin_messages" ON admin_messages FOR UPDATE USING (true);
CREATE POLICY "Allow admin delete on admin_messages" ON admin_messages FOR DELETE USING (true);
