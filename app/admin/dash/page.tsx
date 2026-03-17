'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalMessages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookings, messages] = await Promise.all([
          supabase.from('bookings').select('*', { count: 'exact' }),
          supabase.from('contact_messages').select('*', { count: 'exact' }),
        ])

        if (bookings.error) throw bookings.error
        if (messages.error) throw messages.error

        const pendingCount = await supabase
          .from('bookings')
          .select('*', { count: 'exact' })
          .eq('status', 'Pending')

        setStats({
          totalBookings: bookings.count || 0,
          pendingBookings: pendingCount.count || 0,
          totalMessages: messages.count || 0,
        })
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Fenix Car Hire Management</p>
        </div>
        <button
          onClick={() => router.push('/admin/login')}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Bookings</h3>
              <p className="text-4xl font-bold text-blue-400">{stats.totalBookings}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Pending Bookings</h3>
              <p className="text-4xl font-bold text-orange-400">{stats.pendingBookings}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Messages</h3>
              <p className="text-4xl font-bold text-green-400">{stats.totalMessages}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/admin/bookings"
              className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg p-6 transition-colors group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📅</div>
              <h2 className="text-white font-bold text-lg mb-1">Bookings</h2>
              <p className="text-gray-400 text-sm">Manage rental bookings</p>
            </Link>

            <Link
              href="/admin/quotations"
              className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg p-6 transition-colors group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📋</div>
              <h2 className="text-white font-bold text-lg mb-1">Quotations</h2>
              <p className="text-gray-400 text-sm">Create quotations</p>
            </Link>

            <Link
              href="/admin/invoices"
              className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg p-6 transition-colors group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📄</div>
              <h2 className="text-white font-bold text-lg mb-1">Invoices</h2>
              <p className="text-gray-400 text-sm">Generate invoices</p>
            </Link>

            <Link
              href="/admin/checksheets"
              className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg p-6 transition-colors group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">✓</div>
              <h2 className="text-white font-bold text-lg mb-1">Checksheets</h2>
              <p className="text-gray-400 text-sm">Vehicle inspections</p>
            </Link>

            <Link
              href="/admin/messages"
              className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg p-6 transition-colors group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">💬</div>
              <h2 className="text-white font-bold text-lg mb-1">Messages</h2>
              <p className="text-gray-400 text-sm">Customer messages</p>
            </Link>

            <Link
              href="/admin/payments"
              className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg p-6 transition-colors group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">💳</div>
              <h2 className="text-white font-bold text-lg mb-1">Payments</h2>
              <p className="text-gray-400 text-sm">Payment tracking</p>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
