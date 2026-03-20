import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params

    const { data, error } = await supabase
      .from('booking_items')
      .select('*')
      .eq('booking_id', bookingId)
      .order('item_order', { ascending: true })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[v0] Error fetching booking items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    const body = await request.json()

    const { data, error } = await supabase
      .from('booking_items')
      .insert([
        {
          booking_id: bookingId,
          item_name: body.itemName,
          quantity: body.quantity || 1,
          unit_price: body.unitPrice,
          description: body.description || '',
          item_order: body.itemOrder || 0,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[v0] Error creating booking item:', error)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { itemId } = body

    const { data, error } = await supabase
      .from('booking_items')
      .update({
        item_name: body.itemName,
        quantity: body.quantity || 1,
        unit_price: body.unitPrice,
        description: body.description || '',
        item_order: body.itemOrder || 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[v0] Error updating booking item:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('booking_items')
      .delete()
      .eq('id', itemId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error deleting booking item:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}
