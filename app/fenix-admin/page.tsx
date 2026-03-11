'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { 
  LayoutDashboard, Car, CalendarCheck, FileText, Receipt, 
  AlertTriangle, CreditCard, LogOut, Menu, X, Bell, 
  TrendingUp, Clock, CheckCircle, XCircle, DollarSign, Users, Eye
} from "lucide-react"

type Tab = "overview" | "bookings" | "vehicles" | "invoices" | "quotations" | "payments" | "bad-debts"

interface Stats {
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  totalVehicles: number
  availableVehicles: number
  bookedVehicles: number
  totalInvoices: number
  pendingInvoices: number
  paidInvoices: number
  totalRevenue: number
  pendingRevenue: number
  quotationsCount: number
  badDebtsCount: number
  badDebtsAmount: number
}

interface Booking {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  vehicle_name: string
  pickup_date: string
  return_date: string
  status: string
  created_at: string
}

interface Vehicle {
  id: string
  name: string
  category: string
  price_per_day: number
  is_booked: boolean
  image: string
  seats: number
  transmission: string
}

interface Invoice {
  id: string
  invoice_number: string
  customer_name: string
  customer_email: string
  vehicle_name: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
}

interface Quotation {
  id: string
  customer_name: string
  customer_email: string
  vehicle_name: string
  total_amount: number
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [notifications, setNotifications] = useState<number>(0)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
    fetchData()
    setupRealtimeSubscription()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/fenix-admin/login")
      return
    }
    setUser(user)
    setLoading(false)
  }

  const fetchData = async () => {
    const [bookingsRes, vehiclesRes, invoicesRes, quotationsRes] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("vehicles").select("*"),
      supabase.from("invoices").select("*").order("created_at", { ascending: false }),
      supabase.from("quotations").select("*").order("created_at", { ascending: false }),
    ])

    const bookingsData = bookingsRes.data || []
    const vehiclesData = vehiclesRes.data || []
    const invoicesData = invoicesRes.data || []
    const quotationsData = quotationsRes.data || []

    setBookings(bookingsData)
    setVehicles(vehiclesData)
    setInvoices(invoicesData)
    setQuotations(quotationsData)

    const pendingBookings = bookingsData.filter(b => b.status === "pending").length
    const confirmedBookings = bookingsData.filter(b => b.status === "confirmed").length
    const availableVehicles = vehiclesData.filter(v => !v.is_booked).length
    const bookedVehicles = vehiclesData.filter(v => v.is_booked).length
    const pendingInvoices = invoicesData.filter(i => i.payment_status === "pending" || i.payment_status === "unpaid").length
    const paidInvoices = invoicesData.filter(i => i.payment_status === "paid").length
    const totalRevenue = invoicesData.filter(i => i.payment_status === "paid").reduce((sum, i) => sum + (i.total_amount || 0), 0)
    const pendingRevenue = invoicesData.filter(i => i.payment_status !== "paid").reduce((sum, i) => sum + (i.total_amount || 0), 0)
    const badDebts = invoicesData.filter(i => i.status === "overdue" || i.payment_status === "overdue")
    
    setStats({
      totalBookings: bookingsData.length,
      pendingBookings,
      confirmedBookings,
      totalVehicles: vehiclesData.length,
      availableVehicles,
      bookedVehicles,
      totalInvoices: invoicesData.length,
      pendingInvoices,
      paidInvoices,
      totalRevenue,
      pendingRevenue,
      quotationsCount: quotationsData.length,
      badDebtsCount: badDebts.length,
      badDebtsAmount: badDebts.reduce((sum, i) => sum + (i.total_amount || 0), 0),
    })

    setNotifications(pendingBookings)
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("admin-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "invoices" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "quotations" }, () => fetchData())
      .subscribe()

    return () => { channel.unsubscribe() }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/fenix-admin/login")
  }

  const updateBookingStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id)
    fetchData()
  }

  const updateVehicleStatus = async (id: string, is_booked: boolean) => {
    await supabase.from("vehicles").update({ is_booked }).eq("id", id)
    fetchData()
  }

  const updateInvoiceStatus = async (id: string, payment_status: string) => {
    await supabase.from("invoices").update({ payment_status }).eq("id", id)
    fetchData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { id: "overview" as Tab, label: "Overview", icon: LayoutDashboard },
    { id: "bookings" as Tab, label: "Bookings", icon: CalendarCheck, badge: stats?.pendingBookings },
    { id: "vehicles" as Tab, label: "Vehicles", icon: Car },
    { id: "invoices" as Tab, label: "Invoices", icon: Receipt },
    { id: "quotations" as Tab, label: "Quotations", icon: FileText },
    { id: "payments" as Tab, label: "Payments", icon: CreditCard },
    { id: "bad-debts" as Tab, label: "Bad Debts", icon: AlertTriangle },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-semibold text-gray-900">Fenix Admin</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user?.email?.[0].toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{user?.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-16">
          <div className="flex items-center justify-between h-full px-4 md:px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-gray-600">
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900 capitalize">{activeTab.replace("-", " ")}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6">
          {activeTab === "overview" && <OverviewPanel stats={stats} bookings={bookings} />}
          {activeTab === "bookings" && <BookingsPanel bookings={bookings} onUpdateStatus={updateBookingStatus} />}
          {activeTab === "vehicles" && <VehiclesPanel vehicles={vehicles} onUpdateStatus={updateVehicleStatus} />}
          {activeTab === "invoices" && <InvoicesPanel invoices={invoices} onUpdateStatus={updateInvoiceStatus} />}
          {activeTab === "quotations" && <QuotationsPanel quotations={quotations} />}
          {activeTab === "payments" && <PaymentsPanel invoices={invoices} />}
          {activeTab === "bad-debts" && <BadDebtsPanel invoices={invoices} />}
        </main>
      </div>
    </div>
  )
}

// Overview Panel
function OverviewPanel({ stats, bookings }: { stats: Stats | null, bookings: Booking[] }) {
  const statCards = [
    { label: "Total Bookings", value: stats?.totalBookings || 0, icon: CalendarCheck, color: "bg-blue-100 text-blue-600" },
    { label: "Pending Bookings", value: stats?.pendingBookings || 0, icon: Clock, color: "bg-yellow-100 text-yellow-600" },
    { label: "Available Cars", value: stats?.availableVehicles || 0, icon: Car, color: "bg-green-100 text-green-600" },
    { label: "Booked Cars", value: stats?.bookedVehicles || 0, icon: Car, color: "bg-purple-100 text-purple-600" },
    { label: "Total Revenue", value: `E${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "bg-emerald-100 text-emerald-600" },
    { label: "Pending Revenue", value: `E${(stats?.pendingRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: "bg-orange-100 text-orange-600" },
    { label: "Pending Invoices", value: stats?.pendingInvoices || 0, icon: Receipt, color: "bg-red-100 text-red-600" },
    { label: "Bad Debts", value: stats?.badDebtsCount || 0, icon: AlertTriangle, color: "bg-red-100 text-red-600" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Booking Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Vehicle</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Dates</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{booking.first_name} {booking.last_name}</p>
                    <p className="text-xs text-gray-500">{booking.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{booking.vehicle_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(booking.pickup_date).toLocaleDateString()} - {new Date(booking.return_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                      booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No bookings yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Bookings Panel
function BookingsPanel({ bookings, onUpdateStatus }: { bookings: Booking[], onUpdateStatus: (id: string, status: string) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h3 className="font-semibold text-gray-900">All Bookings</h3>
        <span className="text-sm text-gray-500">{bookings.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Customer</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Contact</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Vehicle</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Dates</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{booking.first_name} {booking.last_name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700">{booking.email}</p>
                  <p className="text-xs text-gray-500">{booking.phone}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{booking.vehicle_name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(booking.pickup_date).toLocaleDateString()} - {new Date(booking.return_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                    booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    booking.status === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {booking.status === "pending" && (
                      <>
                        <button onClick={() => onUpdateStatus(booking.id, "confirmed")} className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => onUpdateStatus(booking.id, "cancelled")} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
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

// Vehicles Panel
function VehiclesPanel({ vehicles, onUpdateStatus }: { vehicles: Vehicle[], onUpdateStatus: (id: string, is_booked: boolean) => void }) {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{vehicles.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Vehicles</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{vehicles.filter(v => !v.is_booked).length}</p>
            <p className="text-sm text-gray-600 mt-1">Available</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{vehicles.filter(v => v.is_booked).length}</p>
            <p className="text-sm text-gray-600 mt-1">Booked</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">All Vehicles</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Vehicle</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Price/Day</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Seats</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{vehicle.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 capitalize">{vehicle.category}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">E{vehicle.price_per_day}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{vehicle.seats}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      vehicle.is_booked ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                    }`}>
                      {vehicle.is_booked ? "Booked" : "Available"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => onUpdateStatus(vehicle.id, !vehicle.is_booked)}
                      className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                      title="Toggle status"
                    >
                      <Eye className="w-4 h-4" />
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

// Invoices Panel
function InvoicesPanel({ invoices, onUpdateStatus }: { invoices: Invoice[], onUpdateStatus: (id: string, payment_status: string) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h3 className="font-semibold text-gray-900">All Invoices</h3>
        <span className="text-sm text-gray-500">{invoices.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Invoice #</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Customer</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Vehicle</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Amount</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Payment Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.invoice_number}</td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">{invoice.customer_name}</p>
                  <p className="text-xs text-gray-500">{invoice.customer_email}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{invoice.vehicle_name}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">E{invoice.total_amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    invoice.payment_status === "paid" ? "bg-green-100 text-green-700" :
                    invoice.payment_status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {invoice.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {invoice.payment_status !== "paid" && (
                    <button 
                      onClick={() => onUpdateStatus(invoice.id, "paid")}
                      className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200"
                      title="Mark as paid"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Quotations Panel
function QuotationsPanel({ quotations }: { quotations: Quotation[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h3 className="font-semibold text-gray-900">All Quotations</h3>
        <span className="text-sm text-gray-500">{quotations.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Customer</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Vehicle</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Amount</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quotations.map((quotation) => (
              <tr key={quotation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">{quotation.customer_name}</p>
                  <p className="text-xs text-gray-500">{quotation.customer_email}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{quotation.vehicle_name}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">E{quotation.total_amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    quotation.status === "accepted" ? "bg-green-100 text-green-700" :
                    quotation.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {quotation.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(quotation.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Payments Panel
function PaymentsPanel({ invoices }: { invoices: Invoice[] }) {
  const paidTotal = invoices.filter(i => i.payment_status === "paid").reduce((sum, i) => sum + (i.total_amount || 0), 0)
  const pendingTotal = invoices.filter(i => i.payment_status !== "paid").reduce((sum, i) => sum + (i.total_amount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Paid</p>
              <p className="text-3xl font-bold text-green-600">E{paidTotal.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Payment</p>
              <p className="text-3xl font-bold text-yellow-600">E{pendingTotal.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Pending Payments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Invoice #</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.filter(i => i.payment_status !== "paid").map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.invoice_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{invoice.customer_name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">E{invoice.total_amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(invoice.created_at).toLocaleDateString()}
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

// Bad Debts Panel
function BadDebtsPanel({ invoices }: { invoices: Invoice[] }) {
  const badDebts = invoices.filter(i => i.status === "overdue" || i.payment_status === "overdue")
  const totalBadDebts = badDebts.reduce((sum, i) => sum + (i.total_amount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="bg-white border-2 border-red-200 rounded-xl p-6 bg-red-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-red-700 mb-1">Total Bad Debts</p>
            <p className="text-3xl font-bold text-red-600">E{totalBadDebts.toLocaleString()}</p>
            <p className="text-sm text-red-600 mt-1">{badDebts.length} invoices overdue</p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Overdue Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Invoice #</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Overdue Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {badDebts.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-red-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.invoice_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{invoice.customer_name}</td>
                  <td className="px-6 py-4 text-sm font-bold text-red-600">E{invoice.total_amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(invoice.created_at).toLocaleDateString()}
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
