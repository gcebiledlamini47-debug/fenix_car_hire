'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('invoices')
  const [invoices, setInvoices] = useState<any[]>([])
  const [quotations, setQuotations] = useState<any[]>([])
  const [checkSheets, setCheckSheets] = useState<any[]>([])
  const [editingInvoice, setEditingInvoice] = useState<any>(null)
  const [editingQuotation, setEditingQuotation] = useState<any>(null)
  const [editingCheckSheet, setEditingCheckSheet] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: invoiceData } = await supabase.from('invoices').select('*')
    const { data: quotationData } = await supabase.from('quotations').select('*')
    const { data: checkSheetData } = await supabase.from('check_sheets').select('*')
    
    setInvoices(invoiceData || [])
    setQuotations(quotationData || [])
    setCheckSheets(checkSheetData || [])
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-[#1a4a8d]">Admin Management Dashboard</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 flex gap-4">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-6 py-3 font-semibold border-b-2 ${
              activeTab === 'invoices'
                ? 'border-[#1a4a8d] text-[#1a4a8d]'
                : 'border-transparent text-gray-600'
            }`}
          >
            Invoices
          </button>
          <button
            onClick={() => setActiveTab('quotations')}
            className={`px-6 py-3 font-semibold border-b-2 ${
              activeTab === 'quotations'
                ? 'border-[#1a4a8d] text-[#1a4a8d]'
                : 'border-transparent text-gray-600'
            }`}
          >
            Quotations
          </button>
          <button
            onClick={() => setActiveTab('checksheets')}
            className={`px-6 py-3 font-semibold border-b-2 ${
              activeTab === 'checksheets'
                ? 'border-[#1a4a8d] text-[#1a4a8d]'
                : 'border-transparent text-gray-600'
            }`}
          >
            Check Sheets
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4">
        {activeTab === 'invoices' && <InvoicesSection invoices={invoices} setEditingInvoice={setEditingInvoice} editingInvoice={editingInvoice} />}
        {activeTab === 'quotations' && <QuotationsSection quotations={quotations} setEditingQuotation={setEditingQuotation} editingQuotation={editingQuotation} />}
        {activeTab === 'checksheets' && <CheckSheetsSection checkSheets={checkSheets} setEditingCheckSheet={setEditingCheckSheet} editingCheckSheet={editingCheckSheet} />}
      </div>
    </div>
  )
}

function InvoicesSection({ invoices, setEditingInvoice, editingInvoice }: any) {
  return (
    <div className="space-y-6">
      <button
        onClick={() => setEditingInvoice({ customerName: '', date: new Date().toISOString().split('T')[0], items: [], total: 0 })}
        className="px-4 py-2 bg-[#1a4a8d] text-white font-semibold rounded"
      >
        Create Invoice
      </button>

      {editingInvoice && <InvoiceForm invoice={editingInvoice} setEditingInvoice={setEditingInvoice} />}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Invoice #</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice: any) => (
              <tr key={invoice.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{invoice.invoiceNumber}</td>
                <td className="px-4 py-2">{invoice.customerName}</td>
                <td className="px-4 py-2">{invoice.date}</td>
                <td className="px-4 py-2">E {invoice.total?.toFixed(2)}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => setEditingInvoice(invoice)} className="text-blue-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function InvoiceForm({ invoice, setEditingInvoice }: any) {
  const [formData, setFormData] = useState(invoice)

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center mb-4">FENIX CAR HIRE - TAX INVOICE</h2>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-2">Customer Name:</label>
            <input
              type="text"
              value={formData.customerName || ''}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full border px-3 py-2"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Date:</label>
            <input
              type="date"
              value={formData.date || ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full border px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 border p-4">
          <div>
            <label className="block font-semibold">Invoice Number:</label>
            <input type="text" value={formData.invoiceNumber || ''} onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })} className="w-full border px-2 py-1" />
          </div>
          <div>
            <label className="block font-semibold">Purchase Order #:</label>
            <input type="text" value={formData.poNumber || ''} onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })} className="w-full border px-2 py-1" />
          </div>
          <div>
            <label className="block font-semibold">Customer Rental:</label>
            <input type="text" value={formData.customerRental || ''} onChange={(e) => setFormData({ ...formData, customerRental: e.target.value })} className="w-full border px-2 py-1" />
          </div>
          <div>
            <label className="block font-semibold">Contact Person:</label>
            <input type="text" value={formData.contactPerson || ''} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} className="w-full border px-2 py-1" />
          </div>
          <div>
            <label className="block font-semibold">Contact Number:</label>
            <input type="text" value={formData.contactNumber || ''} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} className="w-full border px-2 py-1" />
          </div>
          <div>
            <label className="block font-semibold">Email Address:</label>
            <input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border px-2 py-1" />
          </div>
        </div>

        <table className="w-full border mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Description</th>
              <th className="border px-2 py-1">Rate/day</th>
              <th className="border px-2 py-1">Quantity</th>
              <th className="border px-2 py-1">Kms/day</th>
              <th className="border px-2 py-1">Days</th>
              <th className="border px-2 py-1">Excess</th>
              <th className="border px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2].map((idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1"><input type="text" className="w-full border px-1" placeholder="Description" /></td>
                <td className="border px-2 py-1"><input type="number" className="w-full border px-1" placeholder="0.00" /></td>
                <td className="border px-2 py-1"><input type="number" className="w-full border px-1" placeholder="0" /></td>
                <td className="border px-2 py-1"><input type="number" className="w-full border px-1" placeholder="0" /></td>
                <td className="border px-2 py-1"><input type="number" className="w-full border px-1" placeholder="0" /></td>
                <td className="border px-2 py-1"><input type="number" className="w-full border px-1" placeholder="0.00" /></td>
                <td className="border px-2 py-1 bg-gray-100">E 0.00</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-2">Banking Details:</label>
            <div className="space-y-1 text-sm">
              <input type="text" placeholder="Account Name" className="w-full border px-2 py-1" />
              <input type="text" placeholder="Bank Name" className="w-full border px-2 py-1" />
              <input type="text" placeholder="Branch Code" className="w-full border px-2 py-1" />
              <input type="text" placeholder="Account Number" className="w-full border px-2 py-1" />
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Subtotal:</span>
              <span>E 0.00</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">VAT - 15%:</span>
              <span>E 0.00</span>
            </div>
            <div className="flex justify-between bg-blue-100 px-2 py-1">
              <span className="font-bold">Total:</span>
              <span className="font-bold">E 0.00</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setEditingInvoice(null)} className="px-4 py-2 bg-[#1a4a8d] text-white rounded">Save Invoice</button>
          <button onClick={() => setEditingInvoice(null)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
        </div>
      </div>
    </div>
  )
}

function QuotationsSection({ quotations, setEditingQuotation, editingQuotation }: any) {
  return (
    <div className="space-y-6">
      <button
        onClick={() => setEditingQuotation({ customerName: '', date: new Date().toISOString().split('T')[0], items: [], total: 0 })}
        className="px-4 py-2 bg-[#1a4a8d] text-white font-semibold rounded"
      >
        Create Quotation
      </button>

      {editingQuotation && <QuotationForm quotation={editingQuotation} setEditingQuotation={setEditingQuotation} />}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Quote #</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((quote: any) => (
              <tr key={quote.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{quote.quotationNumber}</td>
                <td className="px-4 py-2">{quote.customerName}</td>
                <td className="px-4 py-2">{quote.date}</td>
                <td className="px-4 py-2">E {quote.total?.toFixed(2)}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => setEditingQuotation(quote)} className="text-blue-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function QuotationForm({ quotation, setEditingQuotation }: any) {
  const [formData, setFormData] = useState(quotation)

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h2 className="text-2xl font-bold text-center mb-4">FENIX CAR HIRE - QUOTATION</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-2">Customer Name:</label>
          <input
            type="text"
            value={formData.customerName || ''}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            className="w-full border px-3 py-2"
            placeholder="Enter customer name"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Date:</label>
          <input
            type="date"
            value={formData.date || ''}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full border px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 border p-4">
        <div>
          <label className="block font-semibold">Quotation ID:</label>
          <input type="text" value={formData.quotationId || ''} onChange={(e) => setFormData({ ...formData, quotationId: e.target.value })} className="w-full border px-2 py-1" />
        </div>
        <div>
          <label className="block font-semibold">Customer Rental:</label>
          <input type="text" value={formData.customerRental || ''} onChange={(e) => setFormData({ ...formData, customerRental: e.target.value })} className="w-full border px-2 py-1" />
        </div>
        <div>
          <label className="block font-semibold">Contact Person:</label>
          <input type="text" value={formData.contactPerson || ''} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} className="w-full border px-2 py-1" />
        </div>
        <div>
          <label className="block font-semibold">Contact Number:</label>
          <input type="text" value={formData.contactNumber || ''} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} className="w-full border px-2 py-1" />
        </div>
      </div>

      <table className="w-full border mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Rate/day</th>
            <th className="border px-2 py-1">Quantity</th>
            <th className="border px-2 py-1">Kms Free/day</th>
            <th className="border px-2 py-1">Days</th>
            <th className="border px-2 py-1">Excess</th>
            <th className="border px-2 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2].map((idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1"><input type="text" className="w-full border px-1" placeholder="Description" /></td>
              <td className="border px-2 py-1"><input type="number" className="w-full border px-1" placeholder="0.00" /></td>
              <td className="border px-2 py-1"><input type="number" className="w-full border px-1" placeholder="0" /></td>
              <td className="border px-2 py-1"><input type="number" className="w-full border px-1" placeholder="0" /></td>
              <td className="border px-2 py-1"><input type="number" className="w-full border px-1" placeholder="0" /></td>
              <td className="border px-2 py-1"><input type="number" className="w-full border px-1" placeholder="0.00" /></td>
              <td className="border px-2 py-1 bg-gray-100">E 0.00</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-2">Banking Details:</label>
          <div className="space-y-1 text-sm">
            <input type="text" placeholder="Account Name" className="w-full border px-2 py-1" />
            <input type="text" placeholder="Bank Name" className="w-full border px-2 py-1" />
            <input type="text" placeholder="Branch Code" className="w-full border px-2 py-1" />
            <input type="text" placeholder="Account Number" className="w-full border px-2 py-1" />
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Subtotal:</span>
            <span>E 0.00</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">VAT - 15%:</span>
            <span>E 0.00</span>
          </div>
          <div className="flex justify-between bg-blue-100 px-2 py-1">
            <span className="font-bold">Total:</span>
            <span className="font-bold">E 0.00</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setEditingQuotation(null)} className="px-4 py-2 bg-[#1a4a8d] text-white rounded">Save Quotation</button>
        <button onClick={() => setEditingQuotation(null)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
      </div>
    </div>
  )
}

function CheckSheetsSection({ checkSheets, setEditingCheckSheet, editingCheckSheet }: any) {
  return (
    <div className="space-y-6">
      <button
        onClick={() => setEditingCheckSheet({ vehicleInfo: {}, preRental: {}, postRental: {} })}
        className="px-4 py-2 bg-[#1a4a8d] text-white font-semibold rounded"
      >
        Create Check Sheet
      </button>

      {editingCheckSheet && <CheckSheetForm checkSheet={editingCheckSheet} setEditingCheckSheet={setEditingCheckSheet} />}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Vehicle</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {checkSheets.map((sheet: any) => (
              <tr key={sheet.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{sheet.vehicleName}</td>
                <td className="px-4 py-2">{sheet.date}</td>
                <td className="px-4 py-2">Complete</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => setEditingCheckSheet(sheet)} className="text-blue-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CheckSheetForm({ checkSheet, setEditingCheckSheet }: any) {
  const [formData, setFormData] = useState(checkSheet)

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h2 className="text-2xl font-bold text-center mb-4">FENIX CAR HIRE - VEHICLE CHECK SHEET</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-2">Vehicle Name:</label>
          <input type="text" className="w-full border px-3 py-2" placeholder="Vehicle name" />
        </div>
        <div>
          <label className="block font-semibold mb-2">Registration Number:</label>
          <input type="text" className="w-full border px-3 py-2" placeholder="Registration" />
        </div>
        <div>
          <label className="block font-semibold mb-2">Mileage:</label>
          <input type="number" className="w-full border px-3 py-2" placeholder="Mileage" />
        </div>
        <div>
          <label className="block font-semibold mb-2">Date:</label>
          <input type="date" className="w-full border px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="border p-4">
          <h3 className="font-bold mb-4">PRE-RENTAL INSPECTION</h3>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2"><input type="checkbox" /><span>Headlights</span></div>
            <div className="flex gap-2"><input type="checkbox" /><span>Fog Lights</span></div>
            <div className="flex gap-2"><input type="checkbox" /><span>Windscreen</span></div>
            <div className="flex gap-2"><input type="checkbox" /><span>Wipers</span></div>
            <div className="flex gap-2"><input type="checkbox" /><span>Mirrors</span></div>
            <div className="flex gap-2"><input type="checkbox" /><span>Seat Belts</span></div>
            <div className="flex gap-2"><input type="checkbox" /><span>Horn</span></div>
            <div className="flex gap-2"><input type="checkbox" /><span>Lights</span></div>
          </div>
        </div>

        <div className="border p-4">
          <h3 className="font-bold mb-4">POST-RENTAL INSPECTION</h3>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2"><input type="checkbox" /><span>Headlights</span></div>
            <div className="flex gap-2"><input type="checkbox" /><span>Fog Lights</span></div>
            <div className="flex gap-2"><input type="checkbox" /><span>Windscreen</span></div>
            <div className="flex gap-2"><input type="checkbox" /><span>Wipers</span></div>
            <div className="flex gap-2"><input type="checkbox" /><span>Mirrors</span></div>
            <div className="flex gap-2"><input type="checkbox" /><span>Seat Belts</span></div>
            <div className="flex gap-2"><input type="checkbox" /><span>Horn</span></div>
            <div className="flex gap-2"><input type="checkbox" /><span>Lights</span></div>
          </div>
        </div>
      </div>

      <div className="mb-6 border p-4">
        <h3 className="font-bold mb-4">TIRE CONDITION</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold">Front Right</label>
            <input type="text" placeholder="Condition" className="w-full border px-2 py-1" />
            <input type="text" placeholder="KMs" className="w-full border px-2 py-1 mt-1" />
          </div>
          <div>
            <label className="block font-semibold">Front Left</label>
            <input type="text" placeholder="Condition" className="w-full border px-2 py-1" />
            <input type="text" placeholder="KMs" className="w-full border px-2 py-1 mt-1" />
          </div>
          <div>
            <label className="block font-semibold">Rear Right</label>
            <input type="text" placeholder="Condition" className="w-full border px-2 py-1" />
            <input type="text" placeholder="KMs" className="w-full border px-2 py-1 mt-1" />
          </div>
          <div>
            <label className="block font-semibold">Rear Left</label>
            <input type="text" placeholder="Condition" className="w-full border px-2 py-1" />
            <input type="text" placeholder="KMs" className="w-full border px-2 py-1 mt-1" />
          </div>
        </div>
      </div>

      <div className="mb-6 border p-4">
        <label className="block font-semibold mb-2">Additional Comments:</label>
        <textarea className="w-full border px-3 py-2 h-20" placeholder="Any additional comments or damage noted..."></textarea>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-2">Signature (Name):</label>
          <input type="text" className="w-full border px-3 py-2" placeholder="Name" />
        </div>
        <div>
          <label className="block font-semibold mb-2">Date:</label>
          <input type="date" className="w-full border px-3 py-2" />
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-6 border-t pt-2">
        It is the customer's responsibility to contact the renting branch before accepting the vehicle. It should be remembered that chargeable damage includes tyres, windows and glass.
      </p>

      <div className="flex gap-2">
        <button onClick={() => setEditingCheckSheet(null)} className="px-4 py-2 bg-[#1a4a8d] text-white rounded">Save Check Sheet</button>
        <button onClick={() => setEditingCheckSheet(null)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
      </div>
    </div>
  )
}
