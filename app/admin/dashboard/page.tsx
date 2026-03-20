'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Bell } from 'lucide-react'

interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  newBookingsCount: number
  totalMessages: number
  unreadMessages: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    newBookingsCount: 0,
    totalMessages: 0,
    unreadMessages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentBookings, setRecentBookings] = useState<any[]>([])

  useEffect(() => {
    fetchData()
    setupRealtimeSubscriptions()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch total bookings count
      const { data: allBookings, error: allBookingsError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' })

      // Fetch recent bookings
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
        
        // Count pending bookings
        const pendingCount = bookings.filter((b) => b.status === 'pending').length
        
        // Count new bookings (created in last hour)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
        const newCount = bookings.filter(b => new Date(b.created_at) > oneHourAgo).length
        
        setStats((prev) => ({
          ...prev,
          totalBookings: allBookings?.length || bookings.length,
          pendingBookings: pendingCount,
          newBookingsCount: newCount,
        }))
      }

      if (!messagesError && messages) {
        setStats((prev) => ({
          ...prev,
          totalMessages: messages.length,
          unreadMessages: messages.filter((m) => !m.is_read).length,
        }))
      }
    } catch (error) {
      console.error('[v0] Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscriptions = () => {
    // Subscribe to new bookings
    const bookingsSubscription = supabase
      .channel('bookings-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
        },
        (payload) => {
          console.log('[v0] New booking inserted:', payload)
          setRecentBookings((prev) => [payload.new, ...prev.slice(0, 4)])
          setStats((prev) => ({
            ...prev,
            totalBookings: prev.totalBookings + 1,
            newBookingsCount: prev.newBookingsCount + 1,
          }))
          
          // Show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Booking Submitted', {
              body: `${payload.new.first_name} ${payload.new.last_name} has submitted a new booking`,
              icon: '/favicon.ico'
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(bookingsSubscription)
    }
  }

  const isNewBooking = (createdAt: string) => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    return new Date(createdAt) > oneHourAgo
  }

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
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-6 text-white relative overflow-hidden">
          <div className="absolute top-2 right-2">
            {stats.newBookingsCount > 0 && (
              <Bell className="text-red-200 animate-bounce" size={20} />
            )}
          </div>
          <p className="text-red-100 text-sm font-medium mb-2">New Submissions</p>
          <p className="text-3xl font-bold">{stats.newBookingsCount}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 text-white">
          <p className="text-green-100 text-sm font-medium mb-2">Messages</p>
          <p className="text-3xl font-bold">{stats.totalMessages}</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="border-b border-gray-700 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
          {stats.newBookingsCount > 0 && (
            <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
              {stats.newBookingsCount} New
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                    No bookings yet
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking: any) => (
                  <tr 
                    key={booking.id} 
                    className={`hover:bg-gray-700/50 transition-colors ${
                      isNewBooking(booking.created_at) ? 'bg-red-900/20' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-white flex items-center gap-2">
                      {isNewBooking(booking.created_at) && (
                        <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                          NEW
                        </span>
                      )}
                      <span>{booking.first_name} {booking.last_name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{booking.vehicle_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {booking.pickup_date} - {booking.return_date}
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {new Date(booking.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          booking.status === 'confirmed'
                            ? 'bg-green-900 text-green-200'
                            : booking.status === 'pending'
                              ? 'bg-orange-900 text-orange-200'
                              : booking.status === 'completed'
                                ? 'bg-blue-900 text-blue-200'
                                : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
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
          href="/admin/bookings"
          className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-red-500 transition-colors group"
        >
          <div className="text-red-400 text-2xl mb-3 group-hover:translate-x-1 transition-transform">📅</div>
          <h3 className="text-white font-bold mb-2">View All Bookings</h3>
          <p className="text-gray-400 text-sm">Manage all customer bookings</p>
        </Link>
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
        <Link
          href="/admin/templates"
          className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-yellow-500 transition-colors group"
        >
          <div className="text-yellow-400 text-2xl mb-3 group-hover:translate-x-1 transition-transform">🎨</div>
          <h3 className="text-white font-bold mb-2">Email Templates</h3>
          <p className="text-gray-400 text-sm">Manage notification templates</p>
        </Link>
      </div>
    </div>
  )
}

