'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, Plus, Edit2, Trash2, Save, AlertCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Invoice State
  const [invoices, setInvoices] = useState([])
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [invoiceForm, setInvoiceForm] = useState({
    customer_name: '',
    customer_email: '',
    invoice_number: '',
    date: new Date().toISOString().split('T')[0],
    rental_type: 'Car Rental',
    contact_person: '',
    contact_number: '',
    email_address: '',
    items: [{ description: 'Rental', rate_per_day: 0, quantity: 1, km_free: 0, days: 1, excess: 0, total: 0 }],
    subtotal: 0,
    vat_rate: 15,
    vat_amount: 0,
    total: 0,
    bank_account_name: 'Semperfi Investments (Pty)',
    bank_name: 'Standard Bank Swaziland',
    branch_code: '663164',
    account_number: '9110005689573'
  })

  // Quotation State
  const [quotations, setQuotations] = useState([])
  const [showQuotationForm, setShowQuotationForm] = useState(false)
  const [editingQuotation, setEditingQuotation] = useState(null)
  const [quotationForm, setQuotationForm] = useState({
    customer_name: '',
    customer_email: '',
    quotation_id: '',
    date: new Date().toISOString().split('T')[0],
    rental_type: 'Car Rental',
    contact_person: '',
    contact_number: '',
    email_address: '',
    items: [{ description: 'Rental', rate_per_day: 0, quantity: 1, km_free: 0, days: 1, excess: 0, total: 0 }],
    subtotal: 0,
    vat_rate: 15,
    vat_amount: 0,
    total: 0,
    status: 'pending'
  })

  // Check Sheet State
  const [checkSheets, setCheckSheets] = useState([])
  const [showCheckSheetForm, setShowCheckSheetForm] = useState(false)
  const [editingCheckSheet, setEditingCheckSheet] = useState(null)
  const [checkSheetForm, setCheckSheetForm] = useState({
    pre_rental: {
      vehicle_number: '',
      customer_name: '',
      car_description: '',
      mileage: '',
      fuel_level: '',
      tyre_condition_front_left: '',
      tyre_condition_front_right: '',
      tyre_condition_back_left: '',
      tyre_condition_back_right: '',
      scratches: '',
      dents: '',
      windscreen: '',
      mirrors: '',
      lights: '',
      interior: '',
      additional_info: ''
    },
    post_rental: {
      mileage: '',
      fuel_level: '',
      tyre_condition_front_left: '',
      tyre_condition_front_right: '',
      tyre_condition_back_left: '',
      tyre_condition_back_right: '',
      scratches: '',
      dents: '',
      windscreen: '',
      mirrors: '',
      lights: '',
      interior: '',
      damage_description: '',
      charges: 0
    },
    signature: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Vehicles State
  const [vehicles, setVehicles] = useState([])
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [vehicleForm, setVehicleForm] = useState({
    name: '',
    category: '',
    registration_number: '',
    mileage: 0,
    is_booked: false
  })

  // Bookings State
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [invoicesRes, quotationsRes, checkSheetsRes, vehiclesRes, bookingsRes] = await Promise.all([
        supabase.from('invoices').select('*'),
        supabase.from('quotations').select('*'),
        supabase.from('check_sheets').select('*'),
        supabase.from('vehicles').select('*'),
        supabase.from('bookings').select('*')
      ])

      setInvoices(invoicesRes.data || [])
      setQuotations(quotationsRes.data || [])
      setCheckSheets(checkSheetsRes.data || [])
      setVehicles(vehiclesRes.data || [])
      setBookings(bookingsRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Invoice CRUD
  const handleSaveInvoice = async () => {
    try {
      if (editingInvoice) {
        await supabase.from('invoices').update(invoiceForm).eq('id', editingInvoice.id)
      } else {
        await supabase.from('invoices').insert([invoiceForm])
      }
      await fetchAllData()
      setShowInvoiceForm(false)
      setEditingInvoice(null)
      setInvoiceForm(getDefaultInvoice())
    } catch (error) {
      console.error('Error saving invoice:', error)
    }
  }

  const handleDeleteInvoice = async (id) => {
    if (window.confirm('Delete this invoice?')) {
      try {
        await supabase.from('invoices').delete().eq('id', id)
        await fetchAllData()
      } catch (error) {
        console.error('Error deleting invoice:', error)
      }
    }
  }

  // Quotation CRUD
  const handleSaveQuotation = async () => {
    try {
      if (editingQuotation) {
        await supabase.from('quotations').update(quotationForm).eq('id', editingQuotation.id)
      } else {
        await supabase.from('quotations').insert([quotationForm])
      }
      await fetchAllData()
      setShowQuotationForm(false)
      setEditingQuotation(null)
      setQuotationForm(getDefaultQuotation())
    } catch (error) {
      console.error('Error saving quotation:', error)
    }
  }

  const handleDeleteQuotation = async (id) => {
    if (window.confirm('Delete this quotation?')) {
      try {
        await supabase.from('quotations').delete().eq('id', id)
        await fetchAllData()
      } catch (error) {
        console.error('Error deleting quotation:', error)
      }
    }
  }

  // Check Sheet CRUD
  const handleSaveCheckSheet = async () => {
    try {
      if (editingCheckSheet) {
        await supabase.from('check_sheets').update(checkSheetForm).eq('id', editingCheckSheet.id)
      } else {
        await supabase.from('check_sheets').insert([checkSheetForm])
      }
      await fetchAllData()
      setShowCheckSheetForm(false)
      setEditingCheckSheet(null)
      setCheckSheetForm(getDefaultCheckSheet())
    } catch (error) {
      console.error('Error saving check sheet:', error)
    }
  }

  const handleDeleteCheckSheet = async (id) => {
    if (window.confirm('Delete this check sheet?')) {
      try {
        await supabase.from('check_sheets').delete().eq('id', id)
        await fetchAllData()
      } catch (error) {
        console.error('Error deleting check sheet:', error)
      }
    }
  }

  // Vehicle CRUD
  const handleSaveVehicle = async () => {
    try {
      await supabase.from('vehicles').insert([vehicleForm])
      await fetchAllData()
      setShowVehicleForm(false)
      setVehicleForm({ name: '', category: '', registration_number: '', mileage: 0, is_booked: false })
    } catch (error) {
      console.error('Error saving vehicle:', error)
    }
  }

  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Delete this vehicle?')) {
      try {
        await supabase.from('vehicles').delete().eq('id', id)
        await fetchAllData()
      } catch (error) {
        console.error('Error deleting vehicle:', error)
      }
    }
  }

  const toggleVehicleAvailability = async (vehicle) => {
    try {
      await supabase.from('vehicles').update({ is_booked: !vehicle.is_booked }).eq('id', vehicle.id)
      await fetchAllData()
    } catch (error) {
      console.error('Error updating vehicle:', error)
    }
  }

  const getDefaultInvoice = () => ({
    customer_name: '',
    customer_email: '',
    invoice_number: '',
    date: new Date().toISOString().split('T')[0],
    rental_type: 'Car Rental',
    contact_person: '',
    contact_number: '',
    email_address: '',
    items: [{ description: 'Rental', rate_per_day: 0, quantity: 1, km_free: 0, days: 1, excess: 0, total: 0 }],
    subtotal: 0,
    vat_rate: 15,
    vat_amount: 0,
    total: 0,
    bank_account_name: 'Semperfi Investments (Pty)',
    bank_name: 'Standard Bank Swaziland',
    branch_code: '663164',
    account_number: '9110005689573'
  })

  const getDefaultQuotation = () => ({
    customer_name: '',
    customer_email: '',
    quotation_id: '',
    date: new Date().toISOString().split('T')[0],
    rental_type: 'Car Rental',
    contact_person: '',
    contact_number: '',
    email_address: '',
    items: [{ description: 'Rental', rate_per_day: 0, quantity: 1, km_free: 0, days: 1, excess: 0, total: 0 }],
    subtotal: 0,
    vat_rate: 15,
    vat_amount: 0,
    total: 0,
    status: 'pending'
  })

  const getDefaultCheckSheet = () => ({
    pre_rental: {
      vehicle_number: '',
      customer_name: '',
      car_description: '',
      mileage: '',
      fuel_level: '',
      tyre_condition_front_left: '',
      tyre_condition_front_right: '',
      tyre_condition_back_left: '',
      tyre_condition_back_right: '',
      scratches: '',
      dents: '',
      windscreen: '',
      mirrors: '',
      lights: '',
      interior: '',
      additional_info: ''
    },
    post_rental: {
      mileage: '',
      fuel_level: '',
      tyre_condition_front_left: '',
      tyre_condition_front_right: '',
      tyre_condition_back_left: '',
      tyre_condition_back_right: '',
      scratches: '',
      dents: '',
      windscreen: '',
      mirrors: '',
      lights: '',
      interior: '',
      damage_description: '',
      charges: 0
    },
    signature: '',
    date: new Date().toISOString().split('T')[0]
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1a4a8d] text-white transition-all duration-300 overflow-y-auto`}>
        <div className="p-4 border-b border-blue-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold">Fenix Admin</h1>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-blue-700 rounded">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {['overview', 'bookings', 'vehicles', 'invoices', 'quotations', 'checksheets'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded transition-colors ${
                activeTab === tab ? 'bg-blue-700' : 'hover:bg-blue-600'
              }`}
            >
              {sidebarOpen ? tab.charAt(0).toUpperCase() + tab.slice(1) : tab.charAt(0).toUpperCase()}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Total Invoices</p>
                  <p className="text-3xl font-bold text-blue-600">{invoices.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Total Quotations</p>
                  <p className="text-3xl font-bold text-green-600">{quotations.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Total Vehicles</p>
                  <p className="text-3xl font-bold text-purple-600">{vehicles.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Available Vehicles</p>
                  <p className="text-3xl font-bold text-orange-600">{vehicles.filter(v => !v.is_booked).length}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Booking Requests</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vehicle</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Check-in</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Check-out</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{booking.customer_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{booking.customer_email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{booking.vehicle_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.check_in_date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.check_out_date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Vehicles Tab */}
          {activeTab === 'vehicles' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Vehicle Management</h2>
                <button
                  onClick={() => setShowVehicleForm(!showVehicleForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus size={20} /> Add Vehicle
                </button>
              </div>

              {showVehicleForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                  <h3 className="text-xl font-bold mb-4">Add New Vehicle</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Vehicle Name"
                      value={vehicleForm.name}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                      className="border border-gray-300 rounded px-4 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={vehicleForm.category}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, category: e.target.value })}
                      className="border border-gray-300 rounded px-4 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Registration Number"
                      value={vehicleForm.registration_number}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, registration_number: e.target.value })}
                      className="border border-gray-300 rounded px-4 py-2"
                    />
                    <input
                      type="number"
                      placeholder="Current Mileage"
                      value={vehicleForm.mileage}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, mileage: parseInt(e.target.value) })}
                      className="border border-gray-300 rounded px-4 py-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveVehicle}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Save Vehicle
                    </button>
                    <button
                      onClick={() => setShowVehicleForm(false)}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{vehicle.name}</h3>
                    <p className="text-gray-600 text-sm mb-1">Category: {vehicle.category}</p>
                    <p className="text-gray-600 text-sm mb-1">Reg: {vehicle.registration_number}</p>
                    <p className="text-gray-600 text-sm mb-4">Mileage: {vehicle.mileage} km</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleVehicleAvailability(vehicle)}
                        className={`flex-1 px-3 py-2 rounded text-sm font-semibold text-white ${
                          vehicle.is_booked ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {vehicle.is_booked ? 'Mark Available' : 'Mark Booked'}
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Invoices</h2>
                <button
                  onClick={() => {
                    setEditingInvoice(null)
                    setInvoiceForm(getDefaultInvoice())
                    setShowInvoiceForm(!showInvoiceForm)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus size={20} /> Create Invoice
                </button>
              </div>

              {showInvoiceForm && (
                <InvoiceFormComponent
                  form={invoiceForm}
                  setForm={setInvoiceForm}
                  onSave={handleSaveInvoice}
                  onCancel={() => setShowInvoiceForm(false)}
                />
              )}

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Invoice #</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{invoice.invoice_number}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{invoice.customer_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{invoice.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">E{invoice.total}</td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => {
                              setEditingInvoice(invoice)
                              setInvoiceForm(invoice)
                              setShowInvoiceForm(true)
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quotations Tab */}
          {activeTab === 'quotations' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Quotations</h2>
                <button
                  onClick={() => {
                    setEditingQuotation(null)
                    setQuotationForm(getDefaultQuotation())
                    setShowQuotationForm(!showQuotationForm)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus size={20} /> Create Quotation
                </button>
              </div>

              {showQuotationForm && (
                <QuotationFormComponent
                  form={quotationForm}
                  setForm={setQuotationForm}
                  onSave={handleSaveQuotation}
                  onCancel={() => setShowQuotationForm(false)}
                />
              )}

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quotation #</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotations.map((quotation) => (
                      <tr key={quotation.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{quotation.quotation_id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{quotation.customer_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{quotation.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">E{quotation.total}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            quotation.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {quotation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => {
                              setEditingQuotation(quotation)
                              setQuotationForm(quotation)
                              setShowQuotationForm(true)
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteQuotation(quotation.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Check Sheets Tab */}
          {activeTab === 'checksheets' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Vehicle Check Sheets</h2>
                <button
                  onClick={() => {
                    setEditingCheckSheet(null)
                    setCheckSheetForm(getDefaultCheckSheet())
                    setShowCheckSheetForm(!showCheckSheetForm)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus size={20} /> Create Check Sheet
                </button>
              </div>

              {showCheckSheetForm && (
                <CheckSheetFormComponent
                  form={checkSheetForm}
                  setForm={setCheckSheetForm}
                  onSave={handleSaveCheckSheet}
                  onCancel={() => setShowCheckSheetForm(false)}
                />
              )}

              <div className="space-y-4">
                {checkSheets.map((sheet) => (
                  <div key={sheet.id} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">Vehicle: {sheet.pre_rental.vehicle_number}</p>
                        <p className="text-gray-600 text-sm">Customer: {sheet.pre_rental.customer_name}</p>
                        <p className="text-gray-600 text-sm">Date: {sheet.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCheckSheet(sheet)
                            setCheckSheetForm(sheet)
                            setShowCheckSheetForm(true)
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCheckSheet(sheet.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Invoice Form Component
function InvoiceFormComponent({ form, setForm, onSave, onCancel }) {
  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items]
    newItems[index][field] = value
    setForm({ ...form, items: newItems })
  }

  const calculateTotal = () => {
    const subtotal = form.items.reduce((sum, item) => sum + (item.total || 0), 0)
    const vat = (subtotal * form.vat_rate) / 100
    return { subtotal, vat, total: subtotal + vat }
  }

  const { subtotal, vat, total } = calculateTotal()

  return (
    <div className="bg-white p-8 rounded-lg shadow mb-8 border-2 border-gray-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1a4a8d]">FENIX CAR HIRE</h1>
        <p className="text-gray-600 text-sm">For All your rental Problems</p>
        <p className="text-gray-600 text-xs mt-2">P.O. Box 7909 Mbabane, Eswatini | Lilanga Complex, Lilumemba Street, Sidwashini</p>
        <p className="text-gray-600 text-xs">Call: (+268) 7682797, 7686935 | Fax: (+268) 2422 1045 | Email: reception@fenix.co.sz</p>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-8">
        <div>
          <p className="font-bold text-gray-800">Customer:</p>
          <input
            type="text"
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
          />
        </div>
        <div>
          <p className="font-bold text-gray-800">Invoice Number:</p>
          <input
            type="text"
            value={form.invoice_number}
            onChange={(e) => setForm({ ...form, invoice_number: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
          />
        </div>
        <div>
          <p className="font-bold text-gray-800">Date:</p>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
          />
        </div>
      </div>

      <table className="w-full border-collapse mb-8">
        <thead>
          <tr className="border-2 border-gray-800">
            <th className="border border-gray-800 px-3 py-2 text-left text-sm font-bold">Description</th>
            <th className="border border-gray-800 px-3 py-2 text-left text-sm font-bold">Rate/day</th>
            <th className="border border-gray-800 px-3 py-2 text-left text-sm font-bold">Quantity</th>
            <th className="border border-gray-800 px-3 py-2 text-left text-sm font-bold">Km Free</th>
            <th className="border border-gray-800 px-3 py-2 text-left text-sm font-bold">Days</th>
            <th className="border border-gray-800 px-3 py-2 text-left text-sm font-bold">Excess</th>
            <th className="border border-gray-800 px-3 py-2 text-left text-sm font-bold">Total</th>
          </tr>
        </thead>
        <tbody>
          {form.items.map((item, index) => (
            <tr key={index} className="border-2 border-gray-800">
              <td className="border border-gray-800 px-3 py-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                />
              </td>
              <td className="border border-gray-800 px-3 py-2">
                <input
                  type="number"
                  value={item.rate_per_day}
                  onChange={(e) => handleItemChange(index, 'rate_per_day', parseFloat(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                />
              </td>
              <td className="border border-gray-800 px-3 py-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                />
              </td>
              <td className="border border-gray-800 px-3 py-2">
                <input
                  type="number"
                  value={item.km_free}
                  onChange={(e) => handleItemChange(index, 'km_free', parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                />
              </td>
              <td className="border border-gray-800 px-3 py-2">
                <input
                  type="number"
                  value={item.days}
                  onChange={(e) => handleItemChange(index, 'days', parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                />
              </td>
              <td className="border border-gray-800 px-3 py-2">
                <input
                  type="number"
                  value={item.excess}
                  onChange={(e) => handleItemChange(index, 'excess', parseFloat(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                />
              </td>
              <td className="border border-gray-800 px-3 py-2 text-sm font-semibold">
                E {(item.rate_per_day * item.quantity + item.excess).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className="font-bold text-gray-800 mb-2">Banking Details:</p>
          <div className="text-sm text-gray-700">
            <p>Account Name: {form.bank_account_name}</p>
            <p>Bank Name: {form.bank_name}</p>
            <p>Branch code: {form.branch_code}</p>
            <p>Account Number: {form.account_number}</p>
          </div>
        </div>
        <div>
          <div className="text-right space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold">E {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>VAT - {form.vat_rate}%:</span>
              <span className="font-bold">E {vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Total:</span>
              <span>E {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onSave}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <Save size={20} /> Save Invoice
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// Quotation Form Component
function QuotationFormComponent({ form, setForm, onSave, onCancel }) {
  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items]
    newItems[index][field] = value
    setForm({ ...form, items: newItems })
  }

  const calculateTotal = () => {
    const subtotal = form.items.reduce((sum, item) => sum + (item.total || 0), 0)
    const vat = (subtotal * form.vat_rate) / 100
    return { subtotal, vat, total: subtotal + vat }
  }

  const { subtotal, vat, total } = calculateTotal()

  return (
    <div className="bg-white p-8 rounded-lg shadow mb-8 border-2 border-gray-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1a4a8d]">FENIX CAR HIRE</h1>
        <p className="text-gray-600 text-sm">For All your rental Problems</p>
        <p className="text-gray-600 text-xs mt-2">P.O. Box 7909 Mbabane, Eswatini | Lilanga Complex, Lilumemba Street, Sidwashini</p>
        <p className="text-gray-600 text-xs">Call: (+268) 7682797, 7686935 | Fax: (+268) 2422 1045 | Email: reception@fenix.co.sz</p>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-8">
        <div>
          <p className="font-bold text-gray-800">Customer:</p>
          <input
            type="text"
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
          />
        </div>
        <div>
          <p className="font-bold text-gray-800">Quotation ID:</p>
          <input
            type="text"
            value={form.quotation_id}
            onChange={(e) => setForm({ ...form, quotation_id: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
          />
        </div>
        <div>
          <p className="font-bold text-gray-800">Date:</p>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
          />
        </div>
      </div>

      <table className="w-full border-collapse mb-8">
        <thead>
          <tr className="border-2 border-gray-800">
            <th className="border border-gray-800 px-3 py-2 text-left text-sm font-bold">Description</th>
            <th className="border border-gray-800 px-3 py-2 text-left text-sm font-bold">Rate/day</th>
            <th className="border border-gray-800 px-3 py-2 text-left text-sm font-bold">Quantity</th>
            <th className="border border-gray-800 px-3 py-2 text-left text-sm font-bold">Km Free</th>
            <th className="border border-gray-800 px-3 py-2 text-left text-sm font-bold">Days</th>
            <th className="border border-gray-800 px-3 py-2 text-left text-sm font-bold">Excess</th>
            <th className="border border-gray-800 px-3 py-2 text-left text-sm font-bold">Total</th>
          </tr>
        </thead>
        <tbody>
          {form.items.map((item, index) => (
            <tr key={index} className="border-2 border-gray-800">
              <td className="border border-gray-800 px-3 py-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                />
              </td>
              <td className="border border-gray-800 px-3 py-2">
                <input
                  type="number"
                  value={item.rate_per_day}
                  onChange={(e) => handleItemChange(index, 'rate_per_day', parseFloat(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                />
              </td>
              <td className="border border-gray-800 px-3 py-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                />
              </td>
              <td className="border border-gray-800 px-3 py-2">
                <input
                  type="number"
                  value={item.km_free}
                  onChange={(e) => handleItemChange(index, 'km_free', parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                />
              </td>
              <td className="border border-gray-800 px-3 py-2">
                <input
                  type="number"
                  value={item.days}
                  onChange={(e) => handleItemChange(index, 'days', parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                />
              </td>
              <td className="border border-gray-800 px-3 py-2">
                <input
                  type="number"
                  value={item.excess}
                  onChange={(e) => handleItemChange(index, 'excess', parseFloat(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                />
              </td>
              <td className="border border-gray-800 px-3 py-2 text-sm font-semibold">
                E {(item.rate_per_day * item.quantity + item.excess).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right space-y-2 text-sm mb-8">
        <div className="flex justify-end gap-4">
          <span>Subtotal:</span>
          <span className="font-bold w-32 text-right">E {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-end gap-4 border-t pt-2">
          <span>VAT - {form.vat_rate}%:</span>
          <span className="font-bold w-32 text-right">E {vat.toFixed(2)}</span>
        </div>
        <div className="flex justify-end gap-4 border-t pt-2 text-lg font-bold">
          <span>Total:</span>
          <span className="w-32 text-right">E {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onSave}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <Save size={20} /> Save Quotation
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// Check Sheet Form Component
function CheckSheetFormComponent({ form, setForm, onSave, onCancel }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow mb-8 border-2 border-gray-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1a4a8d]">FENIX CAR HIRE</h1>
        <p className="text-gray-600 text-sm">VEHICLE CHECK SHEET</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-bold text-gray-800 mb-4">PRE-RENTAL INSPECTION</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Vehicle Number"
              value={form.pre_rental.vehicle_number}
              onChange={(e) => setForm({
                ...form,
                pre_rental: { ...form.pre_rental, vehicle_number: e.target.value }
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            />
            <input
              type="text"
              placeholder="Customer Name"
              value={form.pre_rental.customer_name}
              onChange={(e) => setForm({
                ...form,
                pre_rental: { ...form.pre_rental, customer_name: e.target.value }
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            />
            <input
              type="text"
              placeholder="Car Description"
              value={form.pre_rental.car_description}
              onChange={(e) => setForm({
                ...form,
                pre_rental: { ...form.pre_rental, car_description: e.target.value }
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            />
            <input
              type="number"
              placeholder="Mileage"
              value={form.pre_rental.mileage}
              onChange={(e) => setForm({
                ...form,
                pre_rental: { ...form.pre_rental, mileage: e.target.value }
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            />
            <select
              value={form.pre_rental.fuel_level}
              onChange={(e) => setForm({
                ...form,
                pre_rental: { ...form.pre_rental, fuel_level: e.target.value }
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            >
              <option value="">Select Fuel Level</option>
              <option value="Empty">Empty</option>
              <option value="Quarter">1/4</option>
              <option value="Half">1/2</option>
              <option value="Three-Quarter">3/4</option>
              <option value="Full">Full</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-800 mb-4">POST-RENTAL INSPECTION</h3>
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Final Mileage"
              value={form.post_rental.mileage}
              onChange={(e) => setForm({
                ...form,
                post_rental: { ...form.post_rental, mileage: e.target.value }
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            />
            <select
              value={form.post_rental.fuel_level}
              onChange={(e) => setForm({
                ...form,
                post_rental: { ...form.post_rental, fuel_level: e.target.value }
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            >
              <option value="">Select Fuel Level</option>
              <option value="Empty">Empty</option>
              <option value="Quarter">1/4</option>
              <option value="Half">1/2</option>
              <option value="Three-Quarter">3/4</option>
              <option value="Full">Full</option>
            </select>
            <textarea
              placeholder="Damage Description"
              value={form.post_rental.damage_description}
              onChange={(e) => setForm({
                ...form,
                post_rental: { ...form.post_rental, damage_description: e.target.value }
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full text-sm h-20"
            />
            <input
              type="number"
              placeholder="Damage Charges"
              value={form.post_rental.charges}
              onChange={(e) => setForm({
                ...form,
                post_rental: { ...form.post_rental, charges: parseFloat(e.target.value) }
              })}
              className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <label className="font-bold text-gray-800">Inspector Signature:</label>
        <input
          type="text"
          placeholder="Signature"
          value={form.signature}
          onChange={(e) => setForm({ ...form, signature: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={onSave}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <Save size={20} /> Save Check Sheet
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
