'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    bookings: 0,
    quotations: 0,
    invoices: 0,
    messages: 0,
  })
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsRes, quotationsRes, invoicesRes, messagesRes] = await Promise.all([
          supabase.from('bookings').select('*', { count: 'exact' }),
          supabase.from('quotations').select('*', { count: 'exact' }),
          supabase.from('invoices').select('*', { count: 'exact' }),
          supabase.from('contact_messages').select('*', { count: 'exact' }),
        ])

        setStats({
          bookings: bookingsRes.count || 0,
          quotations: quotationsRes.count || 0,
          invoices: invoicesRes.count || 0,
          messages: messagesRes.count || 0,
        })

        // Fetch recent bookings
        const { data: bookings } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        setRecentBookings(bookings || [])
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#1a4a8d] mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Link
          href="/admin/bookings"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-gray-600 text-sm font-medium">Total Bookings</div>
          <div className="text-4xl font-bold text-[#00A8E8] mt-2">{stats.bookings}</div>
        </Link>

        <Link
          href="/admin/quotations"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-gray-600 text-sm font-medium">Quotations</div>
          <div className="text-4xl font-bold text-[#1a4a8d] mt-2">{stats.quotations}</div>
        </Link>

        <Link
          href="/admin/invoices"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-gray-600 text-sm font-medium">Invoices</div>
          <div className="text-4xl font-bold text-green-600 mt-2">{stats.invoices}</div>
        </Link>

        <Link
          href="/admin/messages"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-gray-600 text-sm font-medium">Messages</div>
          <div className="text-4xl font-bold text-orange-600 mt-2">{stats.messages}</div>
        </Link>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-[#1a4a8d] mb-4">Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Customer Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Vehicle</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Pickup Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{booking.first_name} {booking.last_name}</td>
                    <td className="py-3 px-4">{booking.vehicle_name}</td>
                    <td className="py-3 px-4">{booking.pickup_date}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
