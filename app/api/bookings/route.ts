'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Insert booking into Supabase
    const { data, error } = await supabase.from('bookings').insert([
      {
        pickup_date: body.pickupDate,
        return_date: body.returnDate,
        pickup_location: body.pickupLocation,
        return_location: body.returnLocation,
        vehicle_type: body.vehicleType,
        customer_first_name: body.firstName,
        customer_last_name: body.lastName,
        customer_email: body.email,
        customer_phone: body.phone,
        driver_license: body.driverLicense,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('[v0] Error submitting booking:', error);
    return Response.json({ error: 'Failed to submit booking' }, { status: 500 });
  }
}
