'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchInvoices()
  }, [filter])

  const fetchInvoices = async () => {
    try {
      let query = supabase.from('invoices').select('*').order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('payment_status', filter)
      }

      const { data, error } = await query
      if (error) throw error
      setInvoices(data || [])
    } catch (err) {
      console.error('Error fetching invoices:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#1a4a8d]">Invoices</h1>
        <Link
          href="/admin/invoices/new"
          className="px-6 py-2 bg-[#00A8E8] text-white rounded-lg font-semibold hover:bg-[#0087b8] transition-colors"
        >
          Create Invoice
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-4">
        {['all', 'pending', 'paid', 'overdue'].map((status) => (
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

      {/* Invoices List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No invoices found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-6 font-semibold text-gray-700">
                  Invoice #
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Customer</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">
                  Payment Status
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Created</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 font-semibold">{invoice.invoice_number}</td>
                  <td className="py-3 px-6">{invoice.customer_name}</td>
                  <td className="py-3 px-6 font-semibold">
                    E {invoice.total_amount?.toFixed(2)}
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        invoice.payment_status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.payment_status === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {invoice.payment_status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-600">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6">
                    <Link
                      href={`/admin/invoices/${invoice.id}`}
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
