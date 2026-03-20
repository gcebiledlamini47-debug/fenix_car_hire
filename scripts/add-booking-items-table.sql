-- Create booking_items table for managing line items/services in bookings
CREATE TABLE IF NOT EXISTS public.booking_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2),
  description TEXT,
  item_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "admin_read" ON public.booking_items;
DROP POLICY IF EXISTS "admin_insert" ON public.booking_items;
DROP POLICY IF EXISTS "admin_update" ON public.booking_items;
DROP POLICY IF EXISTS "admin_delete" ON public.booking_items;

CREATE POLICY "admin_read" ON public.booking_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_insert" ON public.booking_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update" ON public.booking_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "admin_delete" ON public.booking_items FOR DELETE TO authenticated USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_booking_items_booking_id ON public.booking_items(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_items_order ON public.booking_items(item_order);
