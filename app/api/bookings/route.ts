'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Insert booking into Supabase with correct field names
    const { data, error } = await supabase.from('bookings').insert([
      {
        pickup_date: body.pickupDate,
        return_date: body.returnDate,
        pickup_location: body.pickupLocation,
        return_location: body.returnLocation,
        vehicle_name: body.vehicleType,
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        phone: body.phone,
        driver_license: body.driverLicense,
        status: 'pending',
        notes: body.notes || '',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    // Return success response
    return Response.json({ 
      success: true, 
      data,
      message: 'Booking submitted successfully. An admin will review your booking shortly.'
    });
  } catch (error) {
    console.error('[v0] Error submitting booking:', error);
    return Response.json({ error: 'Failed to submit booking' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) throw error;

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('[v0] Error fetching bookings:', error);
    return Response.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
