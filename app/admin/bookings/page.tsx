'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchBookings()
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
    } catch (err) {
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#1a4a8d]">Bookings</h1>
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
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 font-semibold">
                    {booking.first_name} {booking.last_name}
                  </td>
                  <td className="py-3 px-6 text-sm">{booking.email}</td>
                  <td className="py-3 px-6">{booking.vehicle_name}</td>
                  <td className="py-3 px-6 text-sm">{booking.pickup_date}</td>
                  <td className="py-3 px-6 text-sm">{booking.return_date}</td>
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
