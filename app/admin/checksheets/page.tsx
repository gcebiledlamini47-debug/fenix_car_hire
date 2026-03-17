'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ChecksheetsPage() {
  const [checksheets, setChecksheets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChecksheets()
  }, [])

  const fetchChecksheets = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setChecksheets(data || [])
    } catch (err) {
      console.error('Error fetching checksheets:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#1a4a8d]">Vehicle Checksheets</h1>
      </div>

      {/* Checksheets List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading checksheets...</div>
        ) : checksheets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No checksheets found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-6 font-semibold text-gray-700">
                  Booking ID
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Customer</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Vehicle</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">
                  Pickup Date
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {checksheets.map((checksheet) => (
                <tr key={checksheet.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 text-sm font-mono">
                    {checksheet.id.substring(0, 8)}...
                  </td>
                  <td className="py-3 px-6">
                    {checksheet.first_name} {checksheet.last_name}
                  </td>
                  <td className="py-3 px-6">{checksheet.vehicle_name}</td>
                  <td className="py-3 px-6 text-sm text-gray-600">
                    {checksheet.pickup_date}
                  </td>
                  <td className="py-3 px-6">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      {checksheet.status}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <Link
                      href={`/admin/checksheets/${checksheet.id}`}
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
