'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchQuotations()
  }, [filter])

  const fetchQuotations = async () => {
    try {
      let query = supabase.from('quotations').select('*').order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query
      if (error) throw error
      setQuotations(data || [])
    } catch (err) {
      console.error('Error fetching quotations:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#1a4a8d]">Quotations</h1>
        <Link
          href="/admin/quotations/new"
          className="px-6 py-2 bg-[#00A8E8] text-white rounded-lg font-semibold hover:bg-[#0087b8] transition-colors"
        >
          Create Quotation
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-4">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
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

      {/* Quotations List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading quotations...</div>
        ) : quotations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No quotations found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Customer</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Vehicle</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Created</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((quotation) => (
                <tr key={quotation.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{quotation.customer_name}</td>
                  <td className="py-3 px-6">{quotation.vehicle_name}</td>
                  <td className="py-3 px-6 font-semibold">
                    E {quotation.total_amount?.toFixed(2)}
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        quotation.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : quotation.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {quotation.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-600">
                    {new Date(quotation.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6">
                    <Link
                      href={`/admin/quotations/${quotation.id}`}
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
