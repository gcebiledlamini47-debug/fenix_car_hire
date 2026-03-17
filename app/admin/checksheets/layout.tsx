'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ChecksheetsLayout({ children }: { children: ReactNode }) {
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
      router.push('/admin/login')
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      setIsAuthenticated(false)
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/admin/login')
    }
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-900"><p className="text-gray-300">Loading...</p></div>
  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen bg-gray-900">
      <aside className="w-64 bg-gray-800 text-white p-6 shadow-xl border-r border-gray-700">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Fenix Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Car Hire Management</p>
        </div>
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-3 rounded-lg hover:bg-gray-700 hover:text-blue-300 transition-all text-sm font-medium text-gray-300"><span className="inline-block mr-3">📊</span> Dashboard</Link>
          <Link href="/admin/bookings" className="block px-4 py-3 rounded-lg hover:bg-gray-700 hover:text-blue-300 transition-all text-sm font-medium text-gray-300"><span className="inline-block mr-3">📅</span> Bookings</Link>
          <Link href="/admin/quotations" className="block px-4 py-3 rounded-lg hover:bg-gray-700 hover:text-blue-300 transition-all text-sm font-medium text-gray-300"><span className="inline-block mr-3">📋</span> Quotations</Link>
          <Link href="/admin/checksheets" className="block px-4 py-3 rounded-lg hover:bg-gray-700 hover:text-blue-300 transition-all text-sm font-medium text-gray-300"><span className="inline-block mr-3">✓</span> Checksheets</Link>
          <Link href="/admin/invoices" className="block px-4 py-3 rounded-lg hover:bg-gray-700 hover:text-blue-300 transition-all text-sm font-medium text-gray-300"><span className="inline-block mr-3">📄</span> Invoices</Link>
          <Link href="/admin/messages" className="block px-4 py-3 rounded-lg hover:bg-gray-700 hover:text-blue-300 transition-all text-sm font-medium text-gray-300"><span className="inline-block mr-3">💬</span> Messages</Link>
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg font-medium text-sm text-white">Logout</button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto"><div className="p-8">{children}</div></main>
    </div>
  )
}

