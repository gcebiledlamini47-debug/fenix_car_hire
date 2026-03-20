'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { ChevronDown, ChevronUp, Edit2, Trash2, Plus, Save, X, Eye } from 'lucide-react'

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

interface Vehicle {
  id: string
  name: string
  registration_number: string
  model: string
  color: string
  fuel_type: string
  mileage: number
  is_booked: boolean
  created_at: string
}

interface DocumentTemplate {
  id: string
  template_type: 'invoice' | 'quotation' | 'checksheet'
  name: string
  company_name: string
  company_address: string
  company_phone: string
  company_email: string
  bank_account_name: string
  bank_name: string
  bank_branch_code: string
  bank_account_number: string
  vat_rate: number
  template_data: Record<string, any>
  created_at: string
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'invoices' | 'quotations' | 'checksheets' | 'vehicles' | 'templates'>('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [checksheets, setChecksheets] = useState<CheckSheet[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null)
  const [editingChecksheet, setEditingChecksheet] = useState<CheckSheet | null>(null)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [bookingsData, invoicesData, quotationsData, checksheetsData, vehiclesData, templatesData] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('invoices').select('*').order('created_at', { ascending: false }),
        supabase.from('quotations').select('*').order('created_at', { ascending: false }),
        supabase.from('checksheets').select('*').order('created_at', { ascending: false }),
        supabase.from('vehicles').select('*').order('created_at', { ascending: false }),
        supabase.from('templates').select('*').order('created_at', { ascending: false }),
      ])

      if (bookingsData.data) setBookings(bookingsData.data)
      if (invoicesData.data) setInvoices(invoicesData.data)
      if (quotationsData.data) setQuotations(quotationsData.data)
      if (checksheetsData.data) setChecksheets(checksheetsData.data)
      if (vehiclesData.data) setVehicles(vehiclesData.data)
      if (templatesData.data) setTemplates(templatesData.data)
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

  const saveVehicle = async (vehicle: Vehicle) => {
    try {
      if (vehicle.id) {
        await supabase.from('vehicles').update(vehicle).eq('id', vehicle.id)
      } else {
        await supabase.from('vehicles').insert([vehicle])
      }
      setEditingVehicle(null)
      fetchAllData()
    } catch (error) {
      console.error('Error saving vehicle:', error)
    }
  }

  const deleteVehicle = async (id: string) => {
    try {
      await supabase.from('vehicles').delete().eq('id', id)
      fetchAllData()
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  const saveTemplate = async (template: DocumentTemplate) => {
    try {
      if (template.id) {
        await supabase.from('templates').update(template).eq('id', template.id)
      } else {
        await supabase.from('templates').insert([template])
      }
      setEditingTemplate(null)
      fetchAllData()
    } catch (error) {
      console.error('Error saving template:', error)
    }
  }

  const deleteTemplate = async (id: string) => {
    try {
      await supabase.from('templates').delete().eq('id', id)
      fetchAllData()
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #e8eef5 100%)' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a4a8d] to-[#00A8E8] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">Fenix Car Hire - Admin Portal</h1>
          <p className="text-blue-100 text-sm mt-1">Private Management Dashboard</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b-2 border-[#1a4a8d] sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'bookings', label: 'Bookings', icon: '📅' },
              { id: 'invoices', label: 'Invoices', icon: '📄' },
              { id: 'quotations', label: 'Quotations', icon: '💼' },
              { id: 'checksheets', label: 'Check Sheets', icon: '✓' },
              { id: 'vehicles', label: 'Vehicles', icon: '🚗' },
              { id: 'templates', label: 'Templates', icon: '📋' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#00A8E8] text-[#1a4a8d] bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-[#1a4a8d]'
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
        {activeTab === 'vehicles' && (
          <VehiclesSection
            vehicles={vehicles}
            loading={loading}
            editing={editingVehicle}
            onEdit={setEditingVehicle}
            onSave={saveVehicle}
            onDelete={deleteVehicle}
            onNew={() => setEditingVehicle({
              id: '',
              name: '',
              registration_number: '',
              model: '',
              color: '',
              fuel_type: '',
              mileage: 0,
              is_booked: false,
              created_at: new Date().toISOString(),
            })}
          />
        )}
        {activeTab === 'templates' && (
          <TemplatesSection
            templates={templates}
            loading={loading}
            editing={editingTemplate}
            onEdit={setEditingTemplate}
            onSave={saveTemplate}
            onDelete={deleteTemplate}
            onNew={(type) => setEditingTemplate({
              id: '',
              template_type: type,
              name: '',
              company_name: 'Fenix Car Hire',
              company_address: 'P.O. Box 7909 Mbabane, Eswatini',
              company_phone: '(+268) 2422 1045',
              company_email: 'reception@fenix.co.sz',
              bank_account_name: 'Semperfi Investments (Pty)',
              bank_name: 'Standard Bank Swaziland',
              bank_branch_code: '663164',
              bank_account_number: '9110005689573',
              vat_rate: 15,
              template_data: {},
              created_at: new Date().toISOString(),
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

function VehiclesSection({ vehicles, loading, editing, onEdit, onSave, onDelete, onNew }: any) {
  if (loading) return <div className="text-center py-8">Loading vehicles...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a4a8d]">Vehicle Management</h2>
        <button onClick={onNew} className="bg-[#00A8E8] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#0087b8]">
          <Plus size={20} /> Add Vehicle
        </button>
      </div>

      {editing && (
        <VehicleForm vehicle={editing} onSave={onSave} onCancel={() => onEdit(null)} />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#1a4a8d] to-[#00A8E8] text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-6 py-3 text-left font-semibold">Reg. Number</th>
              <th className="px-6 py-3 text-left font-semibold">Model</th>
              <th className="px-6 py-3 text-left font-semibold">Color</th>
              <th className="px-6 py-3 text-left font-semibold">Fuel Type</th>
              <th className="px-6 py-3 text-left font-semibold">Mileage</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No vehicles available. Create one to get started.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle: Vehicle) => (
                <tr key={vehicle.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-semibold text-gray-900">{vehicle.name}</td>
                  <td className="px-6 py-4 text-gray-700">{vehicle.registration_number}</td>
                  <td className="px-6 py-4 text-gray-700">{vehicle.model}</td>
                  <td className="px-6 py-4 text-gray-700">{vehicle.color}</td>
                  <td className="px-6 py-4 text-gray-700">{vehicle.fuel_type}</td>
                  <td className="px-6 py-4 text-gray-700">{vehicle.mileage} km</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      vehicle.is_booked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {vehicle.is_booked ? 'Booked' : 'Available'}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2 flex">
                    <button onClick={() => onEdit(vehicle)} className="text-blue-600 hover:text-blue-800 transition">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => onDelete(vehicle.id)} className="text-red-600 hover:text-red-800 transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function VehicleForm({ vehicle, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(vehicle)

  return (
    <div className="bg-white rounded-lg shadow p-8 border-l-4 border-[#00A8E8]">
      <h3 className="text-xl font-bold text-[#1a4a8d] mb-6">Add/Edit Vehicle</h3>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Vehicle Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border-2 border-gray-300 p-2 rounded focus:border-[#00A8E8] focus:outline-none"
            placeholder="e.g., Toyota Fortuner"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Registration Number</label>
          <input
            type="text"
            value={formData.registration_number}
            onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
            className="w-full border-2 border-gray-300 p-2 rounded focus:border-[#00A8E8] focus:outline-none"
            placeholder="e.g., EZ 123"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Model</label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="w-full border-2 border-gray-300 p-2 rounded focus:border-[#00A8E8] focus:outline-none"
            placeholder="e.g., 2023"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Color</label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full border-2 border-gray-300 p-2 rounded focus:border-[#00A8E8] focus:outline-none"
            placeholder="e.g., Silver"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Fuel Type</label>
          <select
            value={formData.fuel_type}
            onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
            className="w-full border-2 border-gray-300 p-2 rounded focus:border-[#00A8E8] focus:outline-none"
          >
            <option value="">Select fuel type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Current Mileage (km)</label>
          <input
            type="number"
            value={formData.mileage}
            onChange={(e) => setFormData({ ...formData, mileage: parseFloat(e.target.value) || 0 })}
            className="w-full border-2 border-gray-300 p-2 rounded focus:border-[#00A8E8] focus:outline-none"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Status</label>
          <select
            value={formData.is_booked ? 'booked' : 'available'}
            onChange={(e) => setFormData({ ...formData, is_booked: e.target.value === 'booked' })}
            className="w-full border-2 border-gray-300 p-2 rounded focus:border-[#00A8E8] focus:outline-none"
          >
            <option value="available">Available</option>
            <option value="booked">Booked</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={() => onSave(formData)} className="bg-[#00A8E8] text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#0087b8]">
          <Save size={20} /> Save Vehicle
        </button>
        <button onClick={onCancel} className="bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-500">
          <X size={20} /> Cancel
        </button>
      </div>
    </div>
  )
}

function TemplatesSection({ templates, loading, editing, onEdit, onSave, onDelete, onNew }: any) {
  const [selectedType, setSelectedType] = useState<'invoice' | 'quotation' | 'checksheet' | null>(null)

  if (loading) return <div className="text-center py-8">Loading templates...</div>

  const filteredTemplates = selectedType ? templates.filter((t: DocumentTemplate) => t.template_type === selectedType) : templates

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a4a8d]">Document Templates</h2>
        <div className="space-x-2">
          <button onClick={() => onNew('invoice')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 inline-flex">
            <Plus size={20} /> Invoice Template
          </button>
          <button onClick={() => onNew('quotation')} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 inline-flex">
            <Plus size={20} /> Quotation Template
          </button>
          <button onClick={() => onNew('checksheet')} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-700 inline-flex">
            <Plus size={20} /> CheckSheet Template
          </button>
        </div>
      </div>

      {editing && (
        <TemplateForm template={editing} onSave={onSave} onCancel={() => onEdit(null)} />
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedType(null)}
          className={`px-4 py-2 rounded-lg font-semibold ${!selectedType ? 'bg-[#1a4a8d] text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          All Templates
        </button>
        <button
          onClick={() => setSelectedType('invoice')}
          className={`px-4 py-2 rounded-lg font-semibold ${selectedType === 'invoice' ? 'bg-[#1a4a8d] text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Invoices
        </button>
        <button
          onClick={() => setSelectedType('quotation')}
          className={`px-4 py-2 rounded-lg font-semibold ${selectedType === 'quotation' ? 'bg-[#1a4a8d] text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Quotations
        </button>
        <button
          onClick={() => setSelectedType('checksheet')}
          className={`px-4 py-2 rounded-lg font-semibold ${selectedType === 'checksheet' ? 'bg-[#1a4a8d] text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          CheckSheets
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full text-center py-8 bg-white rounded-lg">
            <p className="text-gray-500">No templates created yet. Create one to get started.</p>
          </div>
        ) : (
          filteredTemplates.map((template: DocumentTemplate) => (
            <div key={template.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition border-l-4 border-[#00A8E8]">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1a4a8d]">{template.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">Type: {template.template_type}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    template.template_type === 'invoice' ? 'bg-blue-100 text-blue-800' :
                    template.template_type === 'quotation' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {template.template_type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{template.company_name}</p>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(template)} className="flex-1 bg-[#00A8E8] text-white px-3 py-2 rounded font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#0087b8]">
                    <Edit2 size={16} /> Edit
                  </button>
                  <button onClick={() => onDelete(template.id)} className="flex-1 bg-red-600 text-white px-3 py-2 rounded font-semibold text-sm hover:bg-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function TemplateForm({ template, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(template)

  return (
    <div className="bg-white rounded-lg shadow p-8 border-l-4 border-[#00A8E8]">
      <h3 className="text-xl font-bold text-[#1a4a8d] mb-6">Edit Document Template</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Template Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border-2 border-gray-300 p-2 rounded focus:border-[#00A8E8] focus:outline-none"
            placeholder="e.g., Standard Invoice Template"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Company Name</label>
          <input
            type="text"
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            className="w-full border-2 border-gray-300 p-2 rounded focus:border-[#00A8E8] focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Company Address</label>
          <textarea
            value={formData.company_address}
            onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
            className="w-full border-2 border-gray-300 p-2 rounded focus:border-[#00A8E8] focus:outline-none"
            rows={3}
          />
        </div>
        <div>
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-gray-700">Phone</label>
            <input
              type="text"
              value={formData.company_phone}
              onChange={(e) => setFormData({ ...formData, company_phone: e.target.value })}
              className="w-full border-2 border-gray-300 p-2 rounded focus:border-[#00A8E8] focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-gray-700">Email</label>
            <input
              type="email"
              value={formData.company_email}
              onChange={(e) => setFormData({ ...formData, company_email: e.target.value })}
              className="w-full border-2 border-gray-300 p-2 rounded focus:border-[#00A8E8] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6 border-2 border-gray-200">
        <h4 className="font-bold text-gray-700 mb-4">Banking Details</h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold text-sm mb-2 text-gray-700">Account Name</label>
            <input
              type="text"
              value={formData.bank_account_name}
              onChange={(e) => setFormData({ ...formData, bank_account_name: e.target.value })}
              className="w-full border-2 border-gray-300 p-2 rounded text-sm focus:border-[#00A8E8] focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-2 text-gray-700">Bank Name</label>
            <input
              type="text"
              value={formData.bank_name}
              onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
              className="w-full border-2 border-gray-300 p-2 rounded text-sm focus:border-[#00A8E8] focus:outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-sm mb-2 text-gray-700">Branch Code</label>
            <input
              type="text"
              value={formData.bank_branch_code}
              onChange={(e) => setFormData({ ...formData, bank_branch_code: e.target.value })}
              className="w-full border-2 border-gray-300 p-2 rounded text-sm focus:border-[#00A8E8] focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-2 text-gray-700">Account Number</label>
            <input
              type="text"
              value={formData.bank_account_number}
              onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
              className="w-full border-2 border-gray-300 p-2 rounded text-sm focus:border-[#00A8E8] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">VAT Rate (%)</label>
        <input
          type="number"
          value={formData.vat_rate}
          onChange={(e) => setFormData({ ...formData, vat_rate: parseFloat(e.target.value) || 0 })}
          className="w-full border-2 border-gray-300 p-2 rounded focus:border-[#00A8E8] focus:outline-none"
          placeholder="15"
        />
      </div>

      <div className="flex gap-4">
        <button onClick={() => onSave(formData)} className="bg-[#00A8E8] text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#0087b8]">
          <Save size={20} /> Save Template
        </button>
        <button onClick={onCancel} className="bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-500">
          <X size={20} /> Cancel
        </button>
      </div>
    </div>
  )
}
