'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Receipt, Download, Send } from 'lucide-react'

interface Invoice {
  id: string
  booking_id: string
  invoice_number: string
  customer_name: string
  customer_email: string
  vehicle_name: string
  amount: number
  status: string
  created_at: string
}

export function InvoicesPanel() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setInvoices(data)
    }
    setLoading(false)
  }

  const generateInvoice = async (bookingId: string) => {
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
      const amount = days * (booking.vehicles?.price_per_day || 0)
      const invoiceNumber = `INV-${Date.now()}`

      const { error } = await supabase.from('invoices').insert([
        {
          booking_id: bookingId,
          invoice_number: invoiceNumber,
          customer_name: booking.customer_name,
          customer_email: booking.customer_email,
          vehicle_name: booking.vehicles?.name,
          amount,
          status: 'draft',
        },
      ])

      if (!error) {
        fetchInvoices()
      }
    }
  }

  const sendInvoice = async (invoice: Invoice) => {
    // Mark as sent
    await supabase.from('invoices').update({ status: 'sent' }).eq('id', invoice.id)
    fetchInvoices()
  }

  const markAsPaid = async (id: string) => {
    const { error } = await supabase.from('invoices').update({ status: 'paid' }).eq('id', id)
    if (!error) {
      fetchInvoices()
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading invoices...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Receipt className="text-[#00A8E8]" size={24} />
          <h2 className="text-2xl font-bold text-[#1a4a8d]">Invoices</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Invoices</p>
          <p className="text-3xl font-bold text-[#00A8E8]">{invoices.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Draft</p>
          <p className="text-3xl font-bold text-yellow-600">{invoices.filter(i => i.status === 'draft').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Paid</p>
          <p className="text-3xl font-bold text-green-600">{invoices.filter(i => i.status === 'paid').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-[#1a4a8d]">E{invoices.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Invoice #</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{invoice.invoice_number}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{invoice.customer_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{invoice.vehicle_name}</td>
                  <td className="px-4 py-3 text-sm font-bold text-[#00A8E8]">E{invoice.amount}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      invoice.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    {invoice.status === 'draft' && (
                      <button
                        onClick={() => sendInvoice(invoice)}
                        className="text-[#00A8E8] hover:text-[#0087b8] inline-flex items-center gap-1"
                      >
                        <Send size={16} /> Send
                      </button>
                    )}
                    {invoice.status === 'sent' && (
                      <button
                        onClick={() => markAsPaid(invoice.id)}
                        className="text-green-600 hover:text-green-800 inline-flex items-center gap-1"
                      >
                        Mark Paid
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
                    >
                      <Download size={16} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
