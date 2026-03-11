'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { ChevronDown, ChevronUp, Edit2, Trash2, Plus, Save, X } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Booking {
  id: string
  customer_name: string
  email: string
  phone: string
  vehicle_name: string
  pickup_date: string
  return_date: string
  status: string
  created_at: string
}

interface Invoice {
  id: string
  customer_name: string
  invoice_number: string
  date: string
  items: any[]
  subtotal: number
  vat: number
  total: number
}

interface Quotation {
  id: string
  customer_name: string
  quotation_number: string
  date: string
  items: any[]
  subtotal: number
  vat: number
  total: number
}

interface CheckSheet {
  id: string
  vehicle_name: string
  customer_name: string
  pre_rental: any
  post_rental: any
  mileage_in: number
  mileage_out: number
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'invoices' | 'quotations' | 'checksheets'>('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [checksheets, setChecksheets] = useState<CheckSheet[]>([])
  const [loading, setLoading] = useState(true)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null)
  const [editingChecksheet, setEditingChecksheet] = useState<CheckSheet | null>(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [bookingsData, invoicesData, quotationsData, checksheetsData] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('invoices').select('*').order('created_at', { ascending: false }),
        supabase.from('quotations').select('*').order('created_at', { ascending: false }),
        supabase.from('checksheets').select('*').order('created_at', { ascending: false }),
      ])

      if (bookingsData.data) setBookings(bookingsData.data)
      if (invoicesData.data) setInvoices(invoicesData.data)
      if (quotationsData.data) setQuotations(quotationsData.data)
      if (checksheetsData.data) setChecksheets(checksheetsData.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveInvoice = async (invoice: Invoice) => {
    try {
      if (invoice.id) {
        await supabase.from('invoices').update(invoice).eq('id', invoice.id)
      } else {
        await supabase.from('invoices').insert([invoice])
      }
      setEditingInvoice(null)
      fetchAllData()
    } catch (error) {
      console.error('Error saving invoice:', error)
    }
  }

  const deleteInvoice = async (id: string) => {
    try {
      await supabase.from('invoices').delete().eq('id', id)
      fetchAllData()
    } catch (error) {
      console.error('Error deleting invoice:', error)
    }
  }

  const saveQuotation = async (quotation: Quotation) => {
    try {
      if (quotation.id) {
        await supabase.from('quotations').update(quotation).eq('id', quotation.id)
      } else {
        await supabase.from('quotations').insert([quotation])
      }
      setEditingQuotation(null)
      fetchAllData()
    } catch (error) {
      console.error('Error saving quotation:', error)
    }
  }

  const deleteQuotation = async (id: string) => {
    try {
      await supabase.from('quotations').delete().eq('id', id)
      fetchAllData()
    } catch (error) {
      console.error('Error deleting quotation:', error)
    }
  }

  const saveChecksheet = async (checksheet: CheckSheet) => {
    try {
      if (checksheet.id) {
        await supabase.from('checksheets').update(checksheet).eq('id', checksheet.id)
      } else {
        await supabase.from('checksheets').insert([checksheet])
      }
      setEditingChecksheet(null)
      fetchAllData()
    } catch (error) {
      console.error('Error saving checksheet:', error)
    }
  }

  const deleteChecksheet = async (id: string) => {
    try {
      await supabase.from('checksheets').delete().eq('id', id)
      fetchAllData()
    } catch (error) {
      console.error('Error deleting checksheet:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-[#1a4a8d]">Fenix Car Hire - Admin Portal</h1>
          <p className="text-gray-600 text-sm mt-1">Private Management Dashboard</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'bookings', label: 'Bookings', icon: '📅' },
              { id: 'invoices', label: 'Invoices', icon: '📄' },
              { id: 'quotations', label: 'Quotations', icon: '💼' },
              { id: 'checksheets', label: 'Check Sheets', icon: '✓' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-semibold text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#00A8E8] text-[#00A8E8]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'bookings' && <BookingsSection bookings={bookings} loading={loading} />}
        {activeTab === 'invoices' && (
          <InvoicesSection
            invoices={invoices}
            loading={loading}
            editing={editingInvoice}
            onEdit={setEditingInvoice}
            onSave={saveInvoice}
            onDelete={deleteInvoice}
            onNew={() => setEditingInvoice({
              id: '',
              customer_name: '',
              invoice_number: '',
              date: new Date().toISOString().split('T')[0],
              items: [],
              subtotal: 0,
              vat: 0,
              total: 0,
            })}
          />
        )}
        {activeTab === 'quotations' && (
          <QuotationsSection
            quotations={quotations}
            loading={loading}
            editing={editingQuotation}
            onEdit={setEditingQuotation}
            onSave={saveQuotation}
            onDelete={deleteQuotation}
            onNew={() => setEditingQuotation({
              id: '',
              customer_name: '',
              quotation_number: '',
              date: new Date().toISOString().split('T')[0],
              items: [],
              subtotal: 0,
              vat: 0,
              total: 0,
            })}
          />
        )}
        {activeTab === 'checksheets' && (
          <CheckSheetsSection
            checksheets={checksheets}
            loading={loading}
            editing={editingChecksheet}
            onEdit={setEditingChecksheet}
            onSave={saveChecksheet}
            onDelete={deleteChecksheet}
            onNew={() => setEditingChecksheet({
              id: '',
              vehicle_name: '',
              customer_name: '',
              pre_rental: {},
              post_rental: {},
              mileage_in: 0,
              mileage_out: 0,
            })}
          />
        )}
      </div>
    </div>
  )
}

function BookingsSection({ bookings, loading }: { bookings: Booking[], loading: boolean }) {
  if (loading) return <div>Loading bookings...</div>
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-[#1a4a8d] mb-6">Booking Notifications</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Customer</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Vehicle</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Pickup</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Return</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Contact</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">{booking.customer_name}</td>
                <td className="px-6 py-4 text-gray-700">{booking.vehicle_name}</td>
                <td className="px-6 py-4 text-gray-700">{booking.pickup_date}</td>
                <td className="px-6 py-4 text-gray-700">{booking.return_date}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">
                    <p>{booking.email}</p>
                    <p>{booking.phone}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function InvoicesSection({ invoices, loading, editing, onEdit, onSave, onDelete, onNew }: any) {
  if (loading) return <div>Loading invoices...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a4a8d]">Invoices</h2>
        <button onClick={onNew} className="bg-[#00A8E8] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#0087b8]">
          <Plus size={20} /> Create Invoice
        </button>
      </div>

      {editing && (
        <InvoiceForm invoice={editing} onSave={onSave} onCancel={() => onEdit(null)} />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Invoice #</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Customer</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Total</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice: Invoice) => (
              <tr key={invoice.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">{invoice.invoice_number}</td>
                <td className="px-6 py-4 text-gray-700">{invoice.customer_name}</td>
                <td className="px-6 py-4 text-gray-700">{invoice.date}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">E {invoice.total.toFixed(2)}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => onEdit(invoice)} className="text-blue-600 hover:text-blue-800">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => onDelete(invoice.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function QuotationsSection({ quotations, loading, editing, onEdit, onSave, onDelete, onNew }: any) {
  if (loading) return <div>Loading quotations...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a4a8d]">Quotations</h2>
        <button onClick={onNew} className="bg-[#00A8E8] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#0087b8]">
          <Plus size={20} /> Create Quotation
        </button>
      </div>

      {editing && (
        <QuotationForm quotation={editing} onSave={onSave} onCancel={() => onEdit(null)} />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Quote #</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Customer</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Total</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((quotation: Quotation) => (
              <tr key={quotation.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">{quotation.quotation_number}</td>
                <td className="px-6 py-4 text-gray-700">{quotation.customer_name}</td>
                <td className="px-6 py-4 text-gray-700">{quotation.date}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">E {quotation.total.toFixed(2)}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => onEdit(quotation)} className="text-blue-600 hover:text-blue-800">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => onDelete(quotation.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CheckSheetsSection({ checksheets, loading, editing, onEdit, onSave, onDelete, onNew }: any) {
  if (loading) return <div>Loading check sheets...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a4a8d]">Vehicle Check Sheets</h2>
        <button onClick={onNew} className="bg-[#00A8E8] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#0087b8]">
          <Plus size={20} /> Create Check Sheet
        </button>
      </div>

      {editing && (
        <CheckSheetForm checksheet={editing} onSave={onSave} onCancel={() => onEdit(null)} />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Vehicle</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Customer</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Mileage In</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Mileage Out</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {checksheets.map((checksheet: CheckSheet) => (
              <tr key={checksheet.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">{checksheet.vehicle_name}</td>
                <td className="px-6 py-4 text-gray-700">{checksheet.customer_name}</td>
                <td className="px-6 py-4 text-gray-700">{checksheet.mileage_in}</td>
                <td className="px-6 py-4 text-gray-700">{checksheet.mileage_out}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => onEdit(checksheet)} className="text-blue-600 hover:text-blue-800">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => onDelete(checksheet.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function InvoiceForm({ invoice, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(invoice)

  const handleSave = () => {
    const vat = formData.subtotal * 0.15
    const total = formData.subtotal + vat
    onSave({ ...formData, vat, total })
  }

  return (
    <div className="bg-white rounded-lg shadow p-8 border-2 border-gray-300">
      <h3 className="text-xl font-bold mb-6">TAX INVOICE</h3>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-2">Invoice Number</label>
          <input
            type="text"
            value={formData.invoice_number}
            onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
            className="w-full border-2 border-gray-400 p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full border-2 border-gray-400 p-2 rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6 border-2 border-gray-400 p-4">
        <div>
          <label className="block font-semibold mb-2">Customer:</label>
          <input
            type="text"
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            className="w-full border-b-2 border-gray-400 p-1"
            placeholder="Customer name"
          />
        </div>
        <div></div>
      </div>

      <div className="mb-6">
        <table className="w-full border-2 border-gray-400">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-400 px-4 py-2 text-left">Description</th>
              <th className="border border-gray-400 px-4 py-2 w-24">Rate/day</th>
              <th className="border border-gray-400 px-4 py-2 w-20">Qty</th>
              <th className="border border-gray-400 px-4 py-2 w-20">Days</th>
              <th className="border border-gray-400 px-4 py-2 w-20">Excess</th>
              <th className="border border-gray-400 px-4 py-2 w-24">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-4 py-2">
                <input type="text" placeholder="Enter description" className="w-full border-b p-1" />
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <input type="number" placeholder="Rate" className="w-full border-b p-1" />
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <input type="number" placeholder="Qty" className="w-full border-b p-1" />
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <input type="number" placeholder="Days" className="w-full border-b p-1" />
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <input type="number" placeholder="Excess" className="w-full border-b p-1" />
              </td>
              <td className="border border-gray-400 px-4 py-2 font-semibold">E 0.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6 border-2 border-gray-400 p-4">
        <h4 className="font-bold mb-2">Banking details:</h4>
        <p>Account Name: Semperfi Investments (Pty)</p>
        <p>Bank Name: Standard Bank Swaziland</p>
        <p>Branch code: 663164</p>
        <p>Account Number: 91100058989573</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6 border-2 border-gray-400 p-4">
        <div></div>
        <div className="space-y-2">
          <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">E {formData.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>VAT - 15%</span><span className="font-semibold">E {(formData.subtotal * 0.15).toFixed(2)}</span></div>
          <div className="flex justify-between border-t-2 border-gray-400 pt-2 font-bold"><span>Total</span><span>E {(formData.subtotal * 1.15).toFixed(2)}</span></div>
        </div>
      </div>

      <input
        type="number"
        placeholder="Subtotal"
        value={formData.subtotal}
        onChange={(e) => setFormData({ ...formData, subtotal: parseFloat(e.target.value) || 0 })}
        className="w-full border-2 border-gray-400 p-2 mb-4 rounded"
      />

      <div className="flex gap-4">
        <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700">
          <Save size={20} /> Save Invoice
        </button>
        <button onClick={onCancel} className="bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-500">
          <X size={20} /> Cancel
        </button>
      </div>
    </div>
  )
}

function QuotationForm({ quotation, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(quotation)

  const handleSave = () => {
    const vat = formData.subtotal * 0.15
    const total = formData.subtotal + vat
    onSave({ ...formData, vat, total })
  }

  return (
    <div className="bg-white rounded-lg shadow p-8 border-2 border-gray-300">
      <h3 className="text-xl font-bold mb-6">QUOTATION</h3>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-2">Quotation Number</label>
          <input
            type="text"
            value={formData.quotation_number}
            onChange={(e) => setFormData({ ...formData, quotation_number: e.target.value })}
            className="w-full border-2 border-gray-400 p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full border-2 border-gray-400 p-2 rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6 border-2 border-gray-400 p-4">
        <div>
          <label className="block font-semibold mb-2">Customer:</label>
          <input
            type="text"
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            className="w-full border-b-2 border-gray-400 p-1"
            placeholder="Customer name"
          />
        </div>
        <div></div>
      </div>

      <div className="mb-6">
        <table className="w-full border-2 border-gray-400">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-400 px-4 py-2 text-left">Description</th>
              <th className="border border-gray-400 px-4 py-2 w-24">Rate/day</th>
              <th className="border border-gray-400 px-4 py-2 w-20">Qty</th>
              <th className="border border-gray-400 px-4 py-2 w-24">Kms Free/day</th>
              <th className="border border-gray-400 px-4 py-2 w-20">Days</th>
              <th className="border border-gray-400 px-4 py-2 w-20">Excess</th>
              <th className="border border-gray-400 px-4 py-2 w-24">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-4 py-2">
                <input type="text" placeholder="Enter description" className="w-full border-b p-1" />
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <input type="number" placeholder="Rate" className="w-full border-b p-1" />
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <input type="number" placeholder="Qty" className="w-full border-b p-1" />
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <input type="number" placeholder="Kms Free" className="w-full border-b p-1" />
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <input type="number" placeholder="Days" className="w-full border-b p-1" />
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <input type="number" placeholder="Excess" className="w-full border-b p-1" />
              </td>
              <td className="border border-gray-400 px-4 py-2 font-semibold">E 0.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6 border-2 border-gray-400 p-4">
        <h4 className="font-bold mb-2">Banking details:</h4>
        <p>Account Name: Semperfi Investments (Pty)</p>
        <p>Bank Name: Standard Bank Swaziland</p>
        <p>Branch code: 663164</p>
        <p>Account Number: 91100058989573</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6 border-2 border-gray-400 p-4">
        <div></div>
        <div className="space-y-2">
          <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">E {formData.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>VAT - 15%</span><span className="font-semibold">E {(formData.subtotal * 0.15).toFixed(2)}</span></div>
          <div className="flex justify-between border-t-2 border-gray-400 pt-2 font-bold"><span>Total</span><span>E {(formData.subtotal * 1.15).toFixed(2)}</span></div>
        </div>
      </div>

      <input
        type="number"
        placeholder="Subtotal"
        value={formData.subtotal}
        onChange={(e) => setFormData({ ...formData, subtotal: parseFloat(e.target.value) || 0 })}
        className="w-full border-2 border-gray-400 p-2 mb-4 rounded"
      />

      <div className="flex gap-4">
        <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700">
          <Save size={20} /> Save Quotation
        </button>
        <button onClick={onCancel} className="bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-500">
          <X size={20} /> Cancel
        </button>
      </div>
    </div>
  )
}

function CheckSheetForm({ checksheet, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(checksheet)

  return (
    <div className="bg-white rounded-lg shadow p-8 border-2 border-gray-300">
      <h3 className="text-xl font-bold mb-6">VEHICLE CHECK SHEET</h3>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-2">Vehicle Name</label>
          <input
            type="text"
            value={formData.vehicle_name}
            onChange={(e) => setFormData({ ...formData, vehicle_name: e.target.value })}
            className="w-full border-2 border-gray-400 p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Customer Name</label>
          <input
            type="text"
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            className="w-full border-2 border-gray-400 p-2 rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-2">Mileage In</label>
          <input
            type="number"
            value={formData.mileage_in}
            onChange={(e) => setFormData({ ...formData, mileage_in: parseFloat(e.target.value) })}
            className="w-full border-2 border-gray-400 p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Mileage Out</label>
          <input
            type="number"
            value={formData.mileage_out}
            onChange={(e) => setFormData({ ...formData, mileage_out: parseFloat(e.target.value) })}
            className="w-full border-2 border-gray-400 p-2 rounded"
          />
        </div>
      </div>

      <div className="mb-6 border-2 border-gray-400 p-4">
        <h4 className="font-bold mb-4">Pre-Rental Inspection</h4>
        <div className="space-y-2">
          {['Headlights', 'Windscreen', 'Tires', 'Mirrors', 'License Plate', 'Lights'].map((item) => (
            <label key={item} className="flex gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6 border-2 border-gray-400 p-4">
        <h4 className="font-bold mb-4">Post-Rental Inspection</h4>
        <div className="space-y-2">
          {['Headlights', 'Windscreen', 'Tires', 'Mirrors', 'License Plate', 'Lights'].map((item) => (
            <label key={item} className="flex gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2">Additional Comments</label>
        <textarea
          className="w-full border-2 border-gray-400 p-2 rounded h-24"
          placeholder="Any additional notes or observations"
        ></textarea>
      </div>

      <div className="flex gap-4">
        <button onClick={() => onSave(formData)} className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700">
          <Save size={20} /> Save Check Sheet
        </button>
        <button onClick={onCancel} className="bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-500">
          <X size={20} /> Cancel
        </button>
      </div>
    </div>
  )
}
