'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Insert contact message into Supabase
    const { data, error } = await supabase.from('contact_messages').insert([
      {
        name: body.name,
        email: body.email,
        phone: body.phone,
        subject: body.subject,
        message: body.message,
        status: 'new',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('[v0] Error submitting contact form:', error);
    return Response.json({ error: 'Failed to submit contact form' }, { status: 500 });
  }
}
