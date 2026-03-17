'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  totalMessages: number
  unreadMessages: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    totalMessages: 0,
    unreadMessages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentBookings, setRecentBookings] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch bookings
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        // Fetch contact messages
        const { data: messages, error: messagesError } = await supabase
          .from('contact_messages')
          .select('*')

        if (!bookingsError && bookings) {
          setRecentBookings(bookings)
          setStats((prev) => ({
            ...prev,
            totalBookings: bookings.length,
            pendingBookings: bookings.filter((b) => b.status === 'Pending').length,
          }))
        }

        if (!messagesError && messages) {
          setStats((prev) => ({
            ...prev,
            totalMessages: messages.length,
            unreadMessages: messages.filter((m) => m.status !== 'read').length,
          }))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to Fenix Car Hire Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white">
          <p className="text-blue-100 text-sm font-medium mb-2">Total Bookings</p>
          <p className="text-3xl font-bold">{stats.totalBookings}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-6 text-white">
          <p className="text-orange-100 text-sm font-medium mb-2">Pending</p>
          <p className="text-3xl font-bold">{stats.pendingBookings}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 text-white">
          <p className="text-green-100 text-sm font-medium mb-2">Messages</p>
          <p className="text-3xl font-bold">{stats.totalMessages}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 text-white">
          <p className="text-purple-100 text-sm font-medium mb-2">Unread</p>
          <p className="text-3xl font-bold">{stats.unreadMessages}</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="border-b border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                    No bookings yet
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-white">
                      {booking.first_name} {booking.last_name}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{booking.vehicle_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {booking.pickup_date} - {booking.return_date}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'Confirmed'
                            ? 'bg-green-900 text-green-200'
                            : booking.status === 'Pending'
                              ? 'bg-orange-900 text-orange-200'
                              : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/quotations"
          className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors group"
        >
          <div className="text-blue-400 text-2xl mb-3 group-hover:translate-x-1 transition-transform">📋</div>
          <h3 className="text-white font-bold mb-2">Create Quotation</h3>
          <p className="text-gray-400 text-sm">Generate quotations for customers</p>
        </Link>
        <Link
          href="/admin/invoices"
          className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-colors group"
        >
          <div className="text-green-400 text-2xl mb-3 group-hover:translate-x-1 transition-transform">📄</div>
          <h3 className="text-white font-bold mb-2">Create Invoice</h3>
          <p className="text-gray-400 text-sm">Generate tax invoices</p>
        </Link>
        <Link
          href="/admin/checksheets"
          className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-orange-500 transition-colors group"
        >
          <div className="text-orange-400 text-2xl mb-3 group-hover:translate-x-1 transition-transform">✓</div>
          <h3 className="text-white font-bold mb-2">Vehicle Checksheet</h3>
          <p className="text-gray-400 text-sm">Create vehicle inspection forms</p>
        </Link>
        <Link
          href="/admin/messages"
          className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-colors group"
        >
          <div className="text-purple-400 text-2xl mb-3 group-hover:translate-x-1 transition-transform">💬</div>
          <h3 className="text-white font-bold mb-2">Customer Messages</h3>
          <p className="text-gray-400 text-sm">View contact submissions</p>
        </Link>
      </div>
    </div>
  )
}

