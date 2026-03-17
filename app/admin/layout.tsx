'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('admin_token='))
      ?.split('=')[1]

    if (token) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    document.cookie = 'admin_token=; Max-Age=0'
    setIsAuthenticated(false)
    router.push('/admin/login')
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated && typeof window !== 'undefined') {
    router.push('/admin/login')
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a4a8d] text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Fenix Admin</h1>
          <p className="text-sm text-gray-300">Car Hire Management</p>
        </div>

        <nav className="space-y-4">
          <Link
            href="/admin/dashboard"
            className="block px-4 py-2 rounded hover:bg-[#00A8E8] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/bookings"
            className="block px-4 py-2 rounded hover:bg-[#00A8E8] transition-colors"
          >
            Bookings
          </Link>
          <Link
            href="/admin/quotations"
            className="block px-4 py-2 rounded hover:bg-[#00A8E8] transition-colors"
          >
            Quotations
          </Link>
          <Link
            href="/admin/checksheets"
            className="block px-4 py-2 rounded hover:bg-[#00A8E8] transition-colors"
          >
            Checksheets
          </Link>
          <Link
            href="/admin/invoices"
            className="block px-4 py-2 rounded hover:bg-[#00A8E8] transition-colors"
          >
            Invoices
          </Link>
          <Link
            href="/admin/messages"
            className="block px-4 py-2 rounded hover:bg-[#00A8E8] transition-colors"
          >
            Messages
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
