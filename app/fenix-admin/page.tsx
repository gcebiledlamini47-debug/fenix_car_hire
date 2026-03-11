'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { 
  LayoutDashboard, Car, CalendarCheck, FileText, Receipt, 
  AlertTriangle, CreditCard, LogOut, Menu, X, Bell, 
  TrendingUp, Clock, CheckCircle, XCircle, DollarSign, Users, Plus, Edit2, Trash2
} from "lucide-react"

type Tab = "overview" | "bookings" | "vehicles" | "invoices" | "quotations" | "check-sheets" | "payments" | "bad-debts"

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // Invoices state
  const [invoices, setInvoices] = useState<any[]>([])
  const [editingInvoice, setEditingInvoice] = useState<any | null>(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [invoiceForm, setInvoiceForm] = useState({
    customer_name: "",
    date: new Date().toISOString().split('T')[0],
    invoice_number: "",
    po_number: "",
    contact_person: "",
    contact_number: "",
    email_address: "",
    description: "",
    rate_per_day: 0,
    quantity: 1,
    kms_per_day: 0,
    days: 0,
    excess: 0,
    total: 0,
    subtotal: 0,
    vat_amount: 0,
    account_name: "",
    bank_name: "",
    branch_code: "",
    account_number: "",
    status: "draft"
  })

  // Quotations state
  const [quotations, setQuotations] = useState<any[]>([])
  const [editingQuotation, setEditingQuotation] = useState<any | null>(null)
  const [showQuotationModal, setShowQuotationModal] = useState(false)
  const [quotationForm, setQuotationForm] = useState({
    customer_name: "",
    date: new Date().toISOString().split('T')[0],
    quotation_id: "",
    customer_type: "",
    contact_person: "",
    contact_number: "",
    email_address: "",
    description: "",
    rate_per_day: 0,
    quantity: 1,
    kms_per_day: 0,
    days: 0,
    excess: 0,
    total: 0,
    subtotal: 0,
    vat_amount: 0,
    account_name: "",
    bank_name: "",
    branch_code: "",
    account_number: "",
    status: "pending"
  })

  // Check Sheet state
  const [checkSheets, setCheckSheets] = useState<any[]>([])
  const [editingCheckSheet, setEditingCheckSheet] = useState<any | null>(null)
  const [showCheckSheetModal, setShowCheckSheetModal] = useState(false)
  const [checkSheetForm, setCheckSheetForm] = useState({
    vehicle_name: "",
    plate_number: "",
    pre_rental_date: new Date().toISOString().split('T')[0],
    post_rental_date: "",
    odometer_pre: 0,
    odometer_post: 0,
    fuel_level_pre: "Full",
    fuel_level_post: "Full",
    tire_condition_pre: "Good",
    tire_condition_post: "Good",
    headlights: true,
    wipers: true,
    battery: true,
    brakes: true,
    ac: true,
    lights_interior: true,
    door_locks: true,
    seatbelts: true,
    mirrors: true,
    windshield: true,
    body_damage: "",
    interior_damage: "",
    customer_name: "",
    signature_pre: "",
    signature_post: "",
    notes: ""
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/fenix-admin/login")
        return
      }
      setUser(user)
      fetchData()
    } catch (error) {
      console.error("Auth error:", error)
      router.push("/fenix-admin/login")
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async () => {
    try {
      // Fetch invoices
      const { data: invoicesData } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false })
      
      // Fetch quotations
      const { data: quotationsData } = await supabase
        .from("quotations")
        .select("*")
        .order("created_at", { ascending: false })

      setInvoices(invoicesData || [])
      setQuotations(quotationsData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/fenix-admin/login")
  }

  const handleSaveInvoice = async () => {
    try {
      if (editingInvoice) {
        await supabase
          .from("invoices")
          .update(invoiceForm)
          .eq("id", editingInvoice.id)
      } else {
        await supabase
          .from("invoices")
          .insert([invoiceForm])
      }
      setShowInvoiceModal(false)
      setEditingInvoice(null)
      setInvoiceForm({
        customer_name: "",
        date: new Date().toISOString().split('T')[0],
        invoice_number: "",
        po_number: "",
        contact_person: "",
        contact_number: "",
        email_address: "",
        description: "",
        rate_per_day: 0,
        quantity: 1,
        kms_per_day: 0,
        days: 0,
        excess: 0,
        total: 0,
        subtotal: 0,
        vat_amount: 0,
        account_name: "",
        bank_name: "",
        branch_code: "",
        account_number: "",
        status: "draft"
      })
      fetchData()
    } catch (error) {
      console.error("Error saving invoice:", error)
    }
  }

  const handleSaveQuotation = async () => {
    try {
      if (editingQuotation) {
        await supabase
          .from("quotations")
          .update(quotationForm)
          .eq("id", editingQuotation.id)
      } else {
        await supabase
          .from("quotations")
          .insert([quotationForm])
      }
      setShowQuotationModal(false)
      setEditingQuotation(null)
      setQuotationForm({
        customer_name: "",
        date: new Date().toISOString().split('T')[0],
        quotation_id: "",
        customer_type: "",
        contact_person: "",
        contact_number: "",
        email_address: "",
        description: "",
        rate_per_day: 0,
        quantity: 1,
        kms_per_day: 0,
        days: 0,
        excess: 0,
        total: 0,
        subtotal: 0,
        vat_amount: 0,
        account_name: "",
        bank_name: "",
        branch_code: "",
        account_number: "",
        status: "pending"
      })
      fetchData()
    } catch (error) {
      console.error("Error saving quotation:", error)
    }
  }

  const handleDeleteInvoice = async (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      try {
        await supabase.from("invoices").delete().eq("id", id)
        fetchData()
      } catch (error) {
        console.error("Error deleting invoice:", error)
      }
    }
  }

  const handleDeleteQuotation = async (id: string) => {
    if (confirm("Are you sure you want to delete this quotation?")) {
      try {
        await supabase.from("quotations").delete().eq("id", id)
        fetchData()
      } catch (error) {
        console.error("Error deleting quotation:", error)
      }
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 overflow-y-auto`}>
        <div className="p-4 border-b">
          <h1 className={`font-bold text-[#1a4a8d] ${!sidebarOpen && 'text-center'}`}>
            {sidebarOpen ? 'Fenix Admin' : 'FA'}
          </h1>
        </div>
        
        <nav className="p-4 space-y-2">
          {[
            { id: 'overview' as Tab, label: 'Dashboard', icon: LayoutDashboard },
            { id: 'bookings' as Tab, label: 'Bookings', icon: CalendarCheck },
            { id: 'vehicles' as Tab, label: 'Vehicles', icon: Car },
            { id: 'invoices' as Tab, label: 'Invoices', icon: Receipt },
            { id: 'quotations' as Tab, label: 'Quotations', icon: FileText },
            { id: 'check-sheets' as Tab, label: 'Check Sheets', icon: CheckCircle },
            { id: 'payments' as Tab, label: 'Payments', icon: CreditCard },
            { id: 'bad-debts' as Tab, label: 'Bad Debts', icon: AlertTriangle },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === item.id
                  ? 'bg-[#00A8E8] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${!sidebarOpen && 'justify-center'}`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab === 'overview' && 'Dashboard'}
              {activeTab === 'bookings' && 'Bookings'}
              {activeTab === 'vehicles' && 'Vehicles'}
              {activeTab === 'invoices' && 'Invoices'}
              {activeTab === 'quotations' && 'Quotations'}
              {activeTab === 'check-sheets' && 'Vehicle Check Sheets'}
              {activeTab === 'payments' && 'Payments'}
              {activeTab === 'bad-debts' && 'Bad Debts'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {/* INVOICES TAB */}
          {activeTab === 'invoices' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Invoices</h3>
                <button
                  onClick={() => {
                    setEditingInvoice(null)
                    setInvoiceForm({
                      customer_name: "",
                      date: new Date().toISOString().split('T')[0],
                      invoice_number: "",
                      po_number: "",
                      contact_person: "",
                      contact_number: "",
                      email_address: "",
                      description: "",
                      rate_per_day: 0,
                      quantity: 1,
                      kms_per_day: 0,
                      days: 0,
                      excess: 0,
                      total: 0,
                      subtotal: 0,
                      vat_amount: 0,
                      account_name: "",
                      bank_name: "",
                      branch_code: "",
                      account_number: "",
                      status: "draft"
                    })
                    setShowInvoiceModal(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00A8E8] text-white rounded-lg hover:bg-[#0087b8]"
                >
                  <Plus className="w-4 h-4" />
                  Create Invoice
                </button>
              </div>

              {/* Invoices Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Invoice #</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{invoice.invoice_number}</td>
                        <td className="px-6 py-4 text-sm">{invoice.customer_name}</td>
                        <td className="px-6 py-4 text-sm font-semibold">E {invoice.total}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                            invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{invoice.date}</td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => {
                              setEditingInvoice(invoice)
                              setInvoiceForm(invoice)
                              setShowInvoiceModal(true)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* QUOTATIONS TAB */}
          {activeTab === 'quotations' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Quotations</h3>
                <button
                  onClick={() => {
                    setEditingQuotation(null)
                    setQuotationForm({
                      customer_name: "",
                      date: new Date().toISOString().split('T')[0],
                      quotation_id: "",
                      customer_type: "",
                      contact_person: "",
                      contact_number: "",
                      email_address: "",
                      description: "",
                      rate_per_day: 0,
                      quantity: 1,
                      kms_per_day: 0,
                      days: 0,
                      excess: 0,
                      total: 0,
                      subtotal: 0,
                      vat_amount: 0,
                      account_name: "",
                      bank_name: "",
                      branch_code: "",
                      account_number: "",
                      status: "pending"
                    })
                    setShowQuotationModal(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00A8E8] text-white rounded-lg hover:bg-[#0087b8]"
                >
                  <Plus className="w-4 h-4" />
                  Create Quotation
                </button>
              </div>

              {/* Quotations Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quotation #</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotations.map((quotation) => (
                      <tr key={quotation.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{quotation.quotation_id}</td>
                        <td className="px-6 py-4 text-sm">{quotation.customer_name}</td>
                        <td className="px-6 py-4 text-sm font-semibold">E {quotation.total}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            quotation.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            quotation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {quotation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{quotation.date}</td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => {
                              setEditingQuotation(quotation)
                              setQuotationForm(quotation)
                              setShowQuotationModal(true)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuotation(quotation.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CHECK SHEETS TAB */}
          {activeTab === 'check-sheets' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Vehicle Check Sheets</h3>
                <button
                  onClick={() => {
                    setEditingCheckSheet(null)
                    setCheckSheetForm({
                      vehicle_name: "",
                      plate_number: "",
                      pre_rental_date: new Date().toISOString().split('T')[0],
                      post_rental_date: "",
                      odometer_pre: 0,
                      odometer_post: 0,
                      fuel_level_pre: "Full",
                      fuel_level_post: "Full",
                      tire_condition_pre: "Good",
                      tire_condition_post: "Good",
                      headlights: true,
                      wipers: true,
                      battery: true,
                      brakes: true,
                      ac: true,
                      lights_interior: true,
                      door_locks: true,
                      seatbelts: true,
                      mirrors: true,
                      windshield: true,
                      body_damage: "",
                      interior_damage: "",
                      customer_name: "",
                      signature_pre: "",
                      signature_post: "",
                      notes: ""
                    })
                    setShowCheckSheetModal(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00A8E8] text-white rounded-lg hover:bg-[#0087b8]"
                >
                  <Plus className="w-4 h-4" />
                  Create Check Sheet
                </button>
              </div>
              <p className="text-gray-600">Check sheet management coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold">Invoice Form</h3>
              <button onClick={() => setShowInvoiceModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={invoiceForm.customer_name}
                  onChange={(e) => setInvoiceForm({...invoiceForm, customer_name: e.target.value})}
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="date"
                  value={invoiceForm.date}
                  onChange={(e) => setInvoiceForm({...invoiceForm, date: e.target.value})}
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Invoice Number"
                  value={invoiceForm.invoice_number}
                  onChange={(e) => setInvoiceForm({...invoiceForm, invoice_number: e.target.value})}
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="PO Number"
                  value={invoiceForm.po_number}
                  onChange={(e) => setInvoiceForm({...invoiceForm, po_number: e.target.value})}
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Contact Person"
                  value={invoiceForm.contact_person}
                  onChange={(e) => setInvoiceForm({...invoiceForm, contact_person: e.target.value})}
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="tel"
                  placeholder="Contact Number"
                  value={invoiceForm.contact_number}
                  onChange={(e) => setInvoiceForm({...invoiceForm, contact_number: e.target.value})}
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={invoiceForm.email_address}
                  onChange={(e) => setInvoiceForm({...invoiceForm, email_address: e.target.value})}
                  className="px-4 py-2 border rounded md:col-span-2"
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold mb-4">Line Items</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Description"
                    value={invoiceForm.description}
                    onChange={(e) => setInvoiceForm({...invoiceForm, description: e.target.value})}
                    className="px-4 py-2 border rounded md:col-span-3"
                  />
                  <input
                    type="number"
                    placeholder="Rate/Day"
                    value={invoiceForm.rate_per_day}
                    onChange={(e) => setInvoiceForm({...invoiceForm, rate_per_day: parseFloat(e.target.value)})}
                    className="px-4 py-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={invoiceForm.quantity}
                    onChange={(e) => setInvoiceForm({...invoiceForm, quantity: parseInt(e.target.value)})}
                    className="px-4 py-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Days"
                    value={invoiceForm.days}
                    onChange={(e) => setInvoiceForm({...invoiceForm, days: parseInt(e.target.value)})}
                    className="px-4 py-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Excess"
                    value={invoiceForm.excess}
                    onChange={(e) => setInvoiceForm({...invoiceForm, excess: parseFloat(e.target.value)})}
                    className="px-4 py-2 border rounded"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold mb-4">Banking Details</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Account Name"
                    value={invoiceForm.account_name}
                    onChange={(e) => setInvoiceForm({...invoiceForm, account_name: e.target.value})}
                    className="px-4 py-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Bank Name"
                    value={invoiceForm.bank_name}
                    onChange={(e) => setInvoiceForm({...invoiceForm, bank_name: e.target.value})}
                    className="px-4 py-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Branch Code"
                    value={invoiceForm.branch_code}
                    onChange={(e) => setInvoiceForm({...invoiceForm, branch_code: e.target.value})}
                    className="px-4 py-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={invoiceForm.account_number}
                    onChange={(e) => setInvoiceForm({...invoiceForm, account_number: e.target.value})}
                    className="px-4 py-2 border rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveInvoice}
                  className="px-4 py-2 bg-[#00A8E8] text-white rounded hover:bg-[#0087b8]"
                >
                  Save Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Modal */}
      {showQuotationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold">Quotation Form</h3>
              <button onClick={() => setShowQuotationModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={quotationForm.customer_name}
                  onChange={(e) => setQuotationForm({...quotationForm, customer_name: e.target.value})}
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="date"
                  value={quotationForm.date}
                  onChange={(e) => setQuotationForm({...quotationForm, date: e.target.value})}
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Quotation ID"
                  value={quotationForm.quotation_id}
                  onChange={(e) => setQuotationForm({...quotationForm, quotation_id: e.target.value})}
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Customer Type"
                  value={quotationForm.customer_type}
                  onChange={(e) => setQuotationForm({...quotationForm, customer_type: e.target.value})}
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Contact Person"
                  value={quotationForm.contact_person}
                  onChange={(e) => setQuotationForm({...quotationForm, contact_person: e.target.value})}
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="tel"
                  placeholder="Contact Number"
                  value={quotationForm.contact_number}
                  onChange={(e) => setQuotationForm({...quotationForm, contact_number: e.target.value})}
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={quotationForm.email_address}
                  onChange={(e) => setQuotationForm({...quotationForm, email_address: e.target.value})}
                  className="px-4 py-2 border rounded md:col-span-2"
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold mb-4">Line Items</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Description"
                    value={quotationForm.description}
                    onChange={(e) => setQuotationForm({...quotationForm, description: e.target.value})}
                    className="px-4 py-2 border rounded md:col-span-3"
                  />
                  <input
                    type="number"
                    placeholder="Rate/Day"
                    value={quotationForm.rate_per_day}
                    onChange={(e) => setQuotationForm({...quotationForm, rate_per_day: parseFloat(e.target.value)})}
                    className="px-4 py-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={quotationForm.quantity}
                    onChange={(e) => setQuotationForm({...quotationForm, quantity: parseInt(e.target.value)})}
                    className="px-4 py-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Days"
                    value={quotationForm.days}
                    onChange={(e) => setQuotationForm({...quotationForm, days: parseInt(e.target.value)})}
                    className="px-4 py-2 border rounded"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold mb-4">Banking Details</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Account Name"
                    value={quotationForm.account_name}
                    onChange={(e) => setQuotationForm({...quotationForm, account_name: e.target.value})}
                    className="px-4 py-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Bank Name"
                    value={quotationForm.bank_name}
                    onChange={(e) => setQuotationForm({...quotationForm, bank_name: e.target.value})}
                    className="px-4 py-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Branch Code"
                    value={quotationForm.branch_code}
                    onChange={(e) => setQuotationForm({...quotationForm, branch_code: e.target.value})}
                    className="px-4 py-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={quotationForm.account_number}
                    onChange={(e) => setQuotationForm({...quotationForm, account_number: e.target.value})}
                    className="px-4 py-2 border rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  onClick={() => setShowQuotationModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveQuotation}
                  className="px-4 py-2 bg-[#00A8E8] text-white rounded hover:bg-[#0087b8]"
                >
                  Save Quotation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
