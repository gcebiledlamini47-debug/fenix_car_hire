'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FileText, Plus, Trash2, Eye } from 'lucide-react'

interface Quotation {
  id: string
  booking_id: string
  customer_name: string
  vehicle_name: string
  pickup_date: string
  dropoff_date: string
  daily_rate: number
  total_amount: number
  status: string
  created_at: string
}

export function QuotationsPanel() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchQuotations()
  }, [])

  const fetchQuotations = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setQuotations(data)
    }
    setLoading(false)
  }

  const generateQuotation = async (bookingId: string) => {
    const { data: booking } = await supabase
      .from('bookings')
      .select('*, vehicles(name, price_per_day)')
      .eq('id', bookingId)
      .single()

    if (booking) {
      const days = Math.ceil(
        (new Date(booking.dropoff_date).getTime() - new Date(booking.pickup_date).getTime()) /
        (1000 * 60 * 60 * 24)
      )
      const total = days * (booking.vehicles?.price_per_day || 0)

      const { error } = await supabase.from('quotations').insert([
        {
          booking_id: bookingId,
          customer_name: booking.customer_name,
          vehicle_name: booking.vehicles?.name,
          pickup_date: booking.pickup_date,
          dropoff_date: booking.dropoff_date,
          daily_rate: booking.vehicles?.price_per_day,
          total_amount: total,
          status: 'pending',
        },
      ])

      if (!error) {
        fetchQuotations()
      }
    }
  }

  const deleteQuotation = async (id: string) => {
    const { error } = await supabase.from('quotations').delete().eq('id', id)
    if (!error) {
      fetchQuotations()
    }
  }

  const calculateDays = (pickup: string, dropoff: string) => {
    return Math.ceil(
      (new Date(dropoff).getTime() - new Date(pickup).getTime()) / (1000 * 60 * 60 * 24)
    )
  }

  if (loading) {
    return <div className="p-6 text-center">Loading quotations...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="text-[#00A8E8]" size={24} />
          <h2 className="text-2xl font-bold text-[#1a4a8d]">Quotations</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Quotations</p>
          <p className="text-3xl font-bold text-[#00A8E8]">{quotations.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{quotations.filter(q => q.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Accepted</p>
          <p className="text-3xl font-bold text-green-600">{quotations.filter(q => q.status === 'accepted').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Value</p>
          <p className="text-3xl font-bold text-[#1a4a8d]">E{quotations.reduce((sum, q) => sum + q.total_amount, 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Dates</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Daily Rate</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {quotations.map((quotation) => (
                <tr key={quotation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{quotation.customer_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{quotation.vehicle_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {calculateDays(quotation.pickup_date, quotation.dropoff_date)} days
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">E{quotation.daily_rate}</td>
                  <td className="px-4 py-3 text-sm font-bold text-[#00A8E8]">E{quotation.total_amount}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      quotation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      quotation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <button
                      onClick={() => setSelectedQuotation(quotation)}
                      className="text-[#00A8E8] hover:text-[#0087b8] inline-flex items-center gap-1"
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      onClick={() => deleteQuotation(quotation.id)}
                      className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Quotation Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Customer</p>
                  <p className="font-semibold">{selectedQuotation.customer_name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Vehicle</p>
                  <p className="font-semibold">{selectedQuotation.vehicle_name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Pickup Date</p>
                  <p className="font-semibold">{new Date(selectedQuotation.pickup_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Dropoff Date</p>
                  <p className="font-semibold">{new Date(selectedQuotation.dropoff_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Daily Rate</p>
                  <p className="font-semibold">E{selectedQuotation.daily_rate}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Amount</p>
                  <p className="font-bold text-[#00A8E8] text-lg">E{selectedQuotation.total_amount}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedQuotation(null)}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
