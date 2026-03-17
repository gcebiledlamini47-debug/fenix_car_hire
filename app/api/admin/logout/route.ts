import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    )

    // Clear the admin token cookie
    response.cookies.delete('admin_token')

    return response
  } catch (error) {
    console.error('[v0] Admin logout error:', error)
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    )
  }
}
