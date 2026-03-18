import { NextResponse } from 'next/server'

export default function proxy(request) {
  const adminToken = request.cookies.get('admin_token')?.value

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!adminToken && request.nextUrl.pathname !== '/admin/login' && request.nextUrl.pathname !== '/signin') {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
