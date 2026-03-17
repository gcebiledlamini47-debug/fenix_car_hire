'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function BookingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (bookingId) {
      fetchBooking()
    }
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single()

      if (error) throw error
      setBooking(data)
      setFormData(data)
    } catch (err) {
      console.error('Error fetching booking:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId)

      if (error) throw error
      alert('Booking updated successfully!')
      router.push('/admin/bookings')
    } catch (err) {
      console.error('Error saving booking:', err)
      alert('Error saving booking')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading booking...</div>
  if (!booking) return <div>Booking not found</div>

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#1a4a8d] mb-8">Edit Booking</h1>

      <div className="bg-white rounded-lg shadow p-8 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#1a4a8d] mb-4 border-b pb-2">
              Customer Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1a4a8d] mb-4 border-b pb-2">
              Booking Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vehicle
                </label>
                <input
                  type="text"
                  value={formData.vehicle_name || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || 'pending'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={formData.pickup_date || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, pickup_date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Return Date
                </label>
                <input
                  type="date"
                  value={formData.return_date || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, return_date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pickup Location
                </label>
                <input
                  type="text"
                  value={formData.pickup_location || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, pickup_location: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Return Location
                </label>
                <input
                  type="text"
                  value={formData.return_location || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, return_location: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#00A8E8] text-white rounded-lg font-semibold hover:bg-[#0087b8] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/bookings')}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
