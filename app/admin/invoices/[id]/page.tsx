'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function InvoiceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const invoiceId = params.id as string

  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice()
    }
  }, [invoiceId])

  const fetchInvoice = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single()

      if (error) throw error
      setInvoice(data)
      setFormData(data)
    } catch (err) {
      console.error('Error fetching invoice:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', invoiceId)

      if (error) throw error
      alert('Invoice updated successfully!')
      router.push('/admin/invoices')
    } catch (err) {
      console.error('Error saving invoice:', err)
      alert('Error saving invoice')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading invoice...</div>
  if (!invoice) return <div>Invoice not found</div>

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#1a4a8d] mb-8">Edit Invoice</h1>

      <div className="bg-white rounded-lg shadow p-8 max-w-4xl">
        {/* Document Preview */}
        <div className="mb-8 p-6 border-2 border-gray-200 rounded-lg bg-gray-50">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#1a4a8d]">FENIX CAR HIRE</h2>
            <p className="text-sm text-gray-600">For all your rental problems</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="font-semibold">Customer:</p>
              <p className="text-lg">{invoice.customer_name}</p>
              <p className="text-sm text-gray-600">{invoice.customer_email}</p>
            </div>
            <div className="text-right">
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="font-semibold">Invoice #:</td>
                    <td>{invoice.invoice_number}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Date:</td>
                    <td>{new Date(invoice.created_at).toLocaleDateString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#1a4a8d] my-4">TAX INVOICE</h3>

          <table className="w-full text-sm border-t border-b my-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left py-2 px-2">Description</th>
                <th className="text-right py-2 px-2">Rate/day</th>
                <th className="text-right py-2 px-2">Days</th>
                <th className="text-right py-2 px-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-2">{invoice.vehicle_name}</td>
                <td className="text-right py-2 px-2">
                  E {invoice.daily_rate?.toFixed(2)}
                </td>
                <td className="text-right py-2 px-2">{invoice.number_of_days}</td>
                <td className="text-right py-2 px-2">
                  E {(invoice.daily_rate * invoice.number_of_days)?.toFixed(2)}
                </td>
              </tr>
              <tr className="border-t">
                <td colSpan={3} className="text-right font-semibold py-2 px-2">
                  Subtotal:
                </td>
                <td className="text-right font-semibold py-2 px-2">
                  E {invoice.subtotal?.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="text-right font-semibold py-2 px-2">
                  VAT (15%):
                </td>
                <td className="text-right font-semibold py-2 px-2">
                  E {(invoice.subtotal * 0.15)?.toFixed(2)}
                </td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td colSpan={3} className="text-right py-2 px-2">
                  Total:
                </td>
                <td className="text-right py-2 px-2">
                  E {invoice.total_amount?.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 text-sm">
            <p className="font-semibold mb-2">Banking details:</p>
            <p>Account Name: Semperfi Investments (Pty)</p>
            <p>Bank Name: Standard Bank Swaziland</p>
            <p>Branch code: 663164</p>
            <p>Account Number: 911000568835</p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={formData.payment_status || 'pending'}
                onChange={(e) =>
                  setFormData({ ...formData, payment_status: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Invoice Status
              </label>
              <select
                value={formData.status || 'draft'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="received">Received</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Daily Rate (E)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.daily_rate || ''}
              onChange={(e) =>
                setFormData({ ...formData, daily_rate: parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Days
              </label>
              <input
                type="number"
                value={formData.number_of_days || ''}
                onChange={(e) =>
                  setFormData({ ...formData, number_of_days: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.discount_percentage || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount_percentage: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8]"
              />
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
              onClick={() => router.push('/admin/invoices')}
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
