'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CreditCard, Plus, CheckCircle, Clock } from 'lucide-react'

interface Payment {
  id: string
  booking_id: string
  customer_name: string
  amount: number
  status: string
  payment_method: string
  payment_date: string
  reference: string
  created_at: string
}

export function PaymentsPanel() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    booking_id: '',
    customer_name: '',
    amount: '',
    payment_method: 'bank_transfer',
    reference: '',
  })
  const supabase = createClient()

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setPayments(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { error } = await supabase.from('payments').insert([
      {
        booking_id: formData.booking_id,
        customer_name: formData.customer_name,
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
        reference: formData.reference,
        status: 'completed',
      },
    ])

    if (!error) {
      fetchPayments()
      setShowForm(false)
      setFormData({
        booking_id: '',
        customer_name: '',
        amount: '',
        payment_method: 'bank_transfer',
        reference: '',
      })
    }
  }

  const confirmPayment = async (id: string) => {
    const { error } = await supabase
      .from('payments')
      .update({ status: 'confirmed' })
      .eq('id', id)
    
    if (!error) {
      fetchPayments()
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading payments...</div>
  }

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
  const completedAmount = payments
    .filter(p => p.status === 'confirmed')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CreditCard className="text-[#00A8E8]" size={24} />
          <h2 className="text-2xl font-bold text-[#1a4a8d]">Payments & Check Sheet</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#00A8E8] text-white px-4 py-2 rounded-lg hover:bg-[#0087b8] transition-colors flex items-center gap-2"
        >
          <Plus size={20} /> Record Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Payments</p>
          <p className="text-3xl font-bold text-[#00A8E8]">{payments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{payments.filter(p => p.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Confirmed</p>
          <p className="text-3xl font-bold text-green-600">{payments.filter(p => p.status === 'confirmed').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Amount</p>
          <p className="text-3xl font-bold text-[#1a4a8d]">E{totalAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Method</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Reference</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{payment.customer_name}</td>
                  <td className="px-4 py-3 text-sm font-bold text-[#00A8E8]">E{payment.amount}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {payment.payment_method.replace(/_/g, ' ').toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{payment.reference}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      payment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {payment.status === 'pending' ? <Clock size={14} /> : <CheckCircle size={14} />}
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {payment.status === 'pending' && (
                      <button
                        onClick={() => confirmPayment(payment.id)}
                        className="text-green-600 hover:text-green-800 font-semibold"
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Record Payment</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name</label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00A8E8]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (E)</label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00A8E8]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                <select
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00A8E8]"
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="mobile_money">Mobile Money</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reference Number</label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00A8E8]"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#00A8E8] text-white py-2 rounded-lg hover:bg-[#0087b8] transition-colors font-semibold"
                >
                  Record Payment
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
