'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function ChecksheetDetailPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<any>({
    exterior_condition: '',
    interior_condition: '',
    lights_working: false,
    wipers_working: false,
    tires_condition: '',
    fuel_level: '',
    mileage: '',
    scratches: false,
    dents: false,
    notes: '',
  })

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
          ...booking,
          notes: formData.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId)

      if (error) throw error
      alert('Checksheet updated successfully!')
      router.push('/admin/checksheets')
    } catch (err) {
      console.error('Error saving checksheet:', err)
      alert('Error saving checksheet')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading checksheet...</div>
  if (!booking) return <div>Booking not found</div>

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#1a4a8d] mb-8">Vehicle Checksheet</h1>

      <div className="bg-white rounded-lg shadow p-8 max-w-4xl">
        {/* Document Header */}
        <div className="mb-8 pb-6 border-b-2 border-gray-300">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1a4a8d]">FENIX CAR HIRE</h2>
              <p className="text-sm text-gray-600">For all your rental problems</p>
            </div>
            <div className="text-right text-sm">
              <p>P.O. Box 2900 Mbabane, Eswatini</p>
              <p>Lilanga Complex, Litsemba Street, Sidvwashini</p>
              <p>Cell: (+268) 76829797, 79646935</p>
              <p>Tele: (+268) 2422 1045</p>
            </div>
          </div>
        </div>

        {/* Booking Info */}
        <div className="mb-8 grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-700">Customer Name:</p>
            <p className="text-lg font-semibold">
              {booking.first_name} {booking.last_name}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Vehicle:</p>
            <p className="text-lg font-semibold">{booking.vehicle_name}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Pickup Date:</p>
            <p className="text-lg">{booking.pickup_date}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Contact:</p>
            <p className="text-lg">{booking.phone}</p>
          </div>
        </div>

        {/* Checksheet Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#1a4a8d] mb-4 border-b pb-2">
              Vehicle Condition Assessment
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Exterior Condition
                </label>
                <textarea
                  value={formData.exterior_condition}
                  onChange={(e) =>
                    setFormData({ ...formData, exterior_condition: e.target.value })
                  }
                  placeholder="Describe exterior condition (scratches, dents, paint condition, etc.)"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Interior Condition
                </label>
                <textarea
                  value={formData.interior_condition}
                  onChange={(e) =>
                    setFormData({ ...formData, interior_condition: e.target.value })
                  }
                  placeholder="Describe interior condition (cleanliness, upholstery, etc.)"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tire Condition
                  </label>
                  <input
                    type="text"
                    value={formData.tires_condition}
                    onChange={(e) =>
                      setFormData({ ...formData, tires_condition: e.target.value })
                    }
                    placeholder="E.g., Good, Fair, Poor"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fuel Level
                  </label>
                  <input
                    type="text"
                    value={formData.fuel_level}
                    onChange={(e) =>
                      setFormData({ ...formData, fuel_level: e.target.value })
                    }
                    placeholder="E.g., Full, Half, Empty"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mileage (km)
                </label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.lights_working}
                    onChange={(e) =>
                      setFormData({ ...formData, lights_working: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="ml-2 font-semibold text-gray-700">Lights Working</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.wipers_working}
                    onChange={(e) =>
                      setFormData({ ...formData, wipers_working: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="ml-2 font-semibold text-gray-700">Wipers Working</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.scratches}
                    onChange={(e) =>
                      setFormData({ ...formData, scratches: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="ml-2 font-semibold text-gray-700">Scratches Noted</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dents}
                    onChange={(e) =>
                      setFormData({ ...formData, dents: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="ml-2 font-semibold text-gray-700">Dents Noted</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Comments
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
            />
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#00A8E8] text-white rounded-lg font-semibold hover:bg-[#0087b8] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Checksheet'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/checksheets')}
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
