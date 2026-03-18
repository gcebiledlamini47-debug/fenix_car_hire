import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get all admin users to debug
    const { data: users, error } = await supabase
      .from('admin_users')
      .select('id, email, password_hash')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ users, count: users?.length || 0 }, { status: 200 })
  } catch (error) {
    console.error('[v0] Check user error:', error)
    return NextResponse.json(
      { message: 'An error occurred', error: String(error) },
      { status: 500 }
    )
  }
}
