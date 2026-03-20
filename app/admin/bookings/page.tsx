'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Bell } from 'lucide-react'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [newBookingCount, setNewBookingCount] = useState(0)

  useEffect(() => {
    fetchBookings()
    setupRealtimeSubscription()
  }, [filter])

  const fetchBookings = async () => {
    try {
      let query = supabase.from('bookings').select('*').order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query
      if (error) throw error
      
      setBookings(data || [])
      
      // Count new bookings (created in last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      const newCount = (data || []).filter(b => new Date(b.created_at) > oneHourAgo).length
      setNewBookingCount(newCount)
    } catch (err) {
      console.error('[v0] Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('bookings-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
        },
        (payload) => {
          console.log('[v0] New booking received:', payload)
          // Add new booking to the top of the list
          setBookings(prev => [payload.new, ...prev])
          setNewBookingCount(prev => prev + 1)
          
          // Show browser notification if available
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Booking Submitted', {
              body: `${payload.new.first_name} ${payload.new.last_name} has submitted a booking`,
              icon: '/favicon.ico'
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }

  const isNewBooking = (createdAt: string) => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    return new Date(createdAt) > oneHourAgo
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#1a4a8d]">Bookings</h1>
          {newBookingCount > 0 && (
            <div className="flex items-center gap-2 mt-2 text-orange-600 font-semibold">
              <Bell size={20} />
              <span>{newBookingCount} new booking{newBookingCount !== 1 ? 's' : ''} submitted</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-4 flex-wrap">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
              filter === status
                ? 'bg-[#00A8E8] text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No bookings found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Customer</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Vehicle</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">
                  Pickup Date
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">
                  Return Date
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Submitted</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr 
                  key={booking.id} 
                  className={`border-b hover:bg-gray-50 ${isNewBooking(booking.created_at) ? 'bg-blue-50' : ''}`}
                >
                  <td className="py-3 px-6 font-semibold">
                    <div className="flex items-center gap-2">
                      {isNewBooking(booking.created_at) && (
                        <span className="inline-block px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
                          NEW
                        </span>
                      )}
                      <span>{booking.first_name} {booking.last_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-sm">{booking.email}</td>
                  <td className="py-3 px-6">{booking.vehicle_name}</td>
                  <td className="py-3 px-6 text-sm">{formatDate(booking.pickup_date)}</td>
                  <td className="py-3 px-6 text-sm">{formatDate(booking.return_date)}</td>
                  <td className="py-3 px-6 text-sm text-gray-600">
                    {new Date(booking.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : booking.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="text-[#00A8E8] hover:underline font-semibold"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
