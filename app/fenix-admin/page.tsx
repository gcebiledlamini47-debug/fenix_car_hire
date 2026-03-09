'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { 
  LayoutDashboard, Car, CalendarCheck, FileText, Receipt, 
  AlertTriangle, CreditCard, LogOut, Menu, X, Bell, Search,
  TrendingUp, Clock, CheckCircle, XCircle, DollarSign, Users
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
    // Fetch all data in parallel
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

    // Calculate stats
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-neutral-800 border-t-white"></div>
          <p className="text-neutral-400 text-sm">Loading...</p>
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
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-black border-r border-neutral-800 transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">F</span>
              </div>
              <span className="font-semibold text-white">Fenix Admin</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-neutral-400 hover:text-white">
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
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
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
          <div className="p-4 border-t border-neutral-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user?.email?.[0].toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{user?.email}</p>
                <p className="text-xs text-neutral-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm border-b border-neutral-800 h-16">
          <div className="flex items-center justify-between h-full px-4 md:px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-neutral-400 hover:text-white">
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-semibold text-white capitalize">{activeTab.replace("-", " ")}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors">
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
    { label: "Total Bookings", value: stats?.totalBookings || 0, icon: CalendarCheck, color: "bg-blue-500/10 text-blue-400" },
    { label: "Pending Bookings", value: stats?.pendingBookings || 0, icon: Clock, color: "bg-yellow-500/10 text-yellow-400" },
    { label: "Available Cars", value: stats?.availableVehicles || 0, icon: Car, color: "bg-green-500/10 text-green-400" },
    { label: "Booked Cars", value: stats?.bookedVehicles || 0, icon: Car, color: "bg-purple-500/10 text-purple-400" },
    { label: "Total Revenue", value: `E${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "bg-emerald-500/10 text-emerald-400" },
    { label: "Pending Revenue", value: `E${(stats?.pendingRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: "bg-orange-500/10 text-orange-400" },
    { label: "Pending Invoices", value: stats?.pendingInvoices || 0, icon: Receipt, color: "bg-red-500/10 text-red-400" },
    { label: "Bad Debts", value: stats?.badDebtsCount || 0, icon: AlertTriangle, color: "bg-red-500/10 text-red-400" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-neutral-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl">
        <div className="px-5 py-4 border-b border-neutral-800">
          <h3 className="font-semibold text-white">Recent Booking Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Vehicle</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Dates</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="hover:bg-neutral-800/50">
                  <td className="px-5 py-4">
                    <p className="text-sm text-white">{booking.first_name} {booking.last_name}</p>
                    <p className="text-xs text-neutral-500">{booking.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-300">{booking.vehicle_name}</td>
                  <td className="px-5 py-4 text-sm text-neutral-300">
                    {new Date(booking.pickup_date).toLocaleDateString()} - {new Date(booking.return_date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      booking.status === "confirmed" ? "bg-green-500/10 text-green-400" :
                      booking.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-neutral-500/10 text-neutral-400"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-neutral-500">No bookings yet</td>
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
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl">
      <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
        <h3 className="font-semibold text-white">All Bookings</h3>
        <span className="text-sm text-neutral-400">{bookings.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Customer</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Contact</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Vehicle</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Dates</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-neutral-800/50">
                <td className="px-5 py-4">
                  <p className="text-sm text-white">{booking.first_name} {booking.last_name}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-neutral-300">{booking.email}</p>
                  <p className="text-xs text-neutral-500">{booking.phone}</p>
                </td>
                <td className="px-5 py-4 text-sm text-neutral-300">{booking.vehicle_name}</td>
                <td className="px-5 py-4 text-sm text-neutral-300">
                  {new Date(booking.pickup_date).toLocaleDateString()} - {new Date(booking.return_date).toLocaleDateString()}
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    booking.status === "confirmed" ? "bg-green-500/10 text-green-400" :
                    booking.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                    booking.status === "cancelled" ? "bg-red-500/10 text-red-400" :
                    "bg-neutral-500/10 text-neutral-400"
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    {booking.status === "pending" && (
                      <>
                        <button onClick={() => onUpdateStatus(booking.id, "confirmed")} className="p-1.5 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => onUpdateStatus(booking.id, "cancelled")} className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20">
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
  const available = vehicles.filter(v => !v.is_booked)
  const booked = vehicles.filter(v => v.is_booked)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-white">{vehicles.length}</p>
          <p className="text-sm text-neutral-400">Total Fleet</p>
        </div>
        <div className="bg-neutral-900 border border-green-800/50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{available.length}</p>
          <p className="text-sm text-neutral-400">Available</p>
        </div>
        <div className="bg-neutral-900 border border-red-800/50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-red-400">{booked.length}</p>
          <p className="text-sm text-neutral-400">Booked</p>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className={`bg-neutral-900 border rounded-xl overflow-hidden ${vehicle.is_booked ? "border-red-800/50" : "border-green-800/50"}`}>
            <div className="aspect-video bg-neutral-800 flex items-center justify-center">
              {vehicle.image ? (
                <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
              ) : (
                <Car className="w-12 h-12 text-neutral-600" />
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-white">{vehicle.name}</h4>
                  <p className="text-xs text-neutral-400">{vehicle.category} | {vehicle.seats} seats | {vehicle.transmission}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${vehicle.is_booked ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
                  {vehicle.is_booked ? "Booked" : "Available"}
                </span>
              </div>
              <p className="text-lg font-bold text-white mb-3">E{vehicle.price_per_day}/day</p>
              <button
                onClick={() => onUpdateStatus(vehicle.id, !vehicle.is_booked)}
                className={`w-full py-2 text-sm font-medium rounded-lg transition-colors ${
                  vehicle.is_booked 
                    ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" 
                    : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                }`}
              >
                Mark as {vehicle.is_booked ? "Available" : "Booked"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Invoices Panel
function InvoicesPanel({ invoices, onUpdateStatus }: { invoices: Invoice[], onUpdateStatus: (id: string, status: string) => void }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl">
      <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
        <h3 className="font-semibold text-white">All Invoices</h3>
        <span className="text-sm text-neutral-400">{invoices.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Invoice #</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Customer</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Vehicle</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Amount</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-neutral-800/50">
                <td className="px-5 py-4 text-sm text-white font-mono">{invoice.invoice_number}</td>
                <td className="px-5 py-4">
                  <p className="text-sm text-white">{invoice.customer_name}</p>
                  <p className="text-xs text-neutral-500">{invoice.customer_email}</p>
                </td>
                <td className="px-5 py-4 text-sm text-neutral-300">{invoice.vehicle_name}</td>
                <td className="px-5 py-4 text-sm text-white font-semibold">E{(invoice.total_amount || 0).toLocaleString()}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    invoice.payment_status === "paid" ? "bg-green-500/10 text-green-400" :
                    invoice.payment_status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-red-500/10 text-red-400"
                  }`}>
                    {invoice.payment_status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {invoice.payment_status !== "paid" && (
                    <button onClick={() => onUpdateStatus(invoice.id, "paid")} className="px-3 py-1 text-xs bg-green-500/10 text-green-400 rounded hover:bg-green-500/20">
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-neutral-500">No invoices yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Quotations Panel
function QuotationsPanel({ quotations }: { quotations: Quotation[] }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl">
      <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
        <h3 className="font-semibold text-white">All Quotations</h3>
        <span className="text-sm text-neutral-400">{quotations.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Customer</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Vehicle</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Amount</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {quotations.map((quote) => (
              <tr key={quote.id} className="hover:bg-neutral-800/50">
                <td className="px-5 py-4">
                  <p className="text-sm text-white">{quote.customer_name}</p>
                  <p className="text-xs text-neutral-500">{quote.customer_email}</p>
                </td>
                <td className="px-5 py-4 text-sm text-neutral-300">{quote.vehicle_name}</td>
                <td className="px-5 py-4 text-sm text-white font-semibold">E{(quote.total_amount || 0).toLocaleString()}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    quote.status === "accepted" ? "bg-green-500/10 text-green-400" :
                    quote.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-red-500/10 text-red-400"
                  }`}>
                    {quote.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-neutral-400">{new Date(quote.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {quotations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-neutral-500">No quotations yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Payments Panel
function PaymentsPanel({ invoices }: { invoices: Invoice[] }) {
  const paid = invoices.filter(i => i.payment_status === "paid")
  const pending = invoices.filter(i => i.payment_status === "pending" || i.payment_status === "unpaid")
  const totalPaid = paid.reduce((sum, i) => sum + (i.total_amount || 0), 0)
  const totalPending = pending.reduce((sum, i) => sum + (i.total_amount || 0), 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-green-800/50 rounded-xl p-6">
          <p className="text-sm text-neutral-400 mb-1">Total Paid</p>
          <p className="text-3xl font-bold text-green-400">E{totalPaid.toLocaleString()}</p>
          <p className="text-xs text-neutral-500 mt-1">{paid.length} invoices</p>
        </div>
        <div className="bg-neutral-900 border border-yellow-800/50 rounded-xl p-6">
          <p className="text-sm text-neutral-400 mb-1">Pending Payment</p>
          <p className="text-3xl font-bold text-yellow-400">E{totalPending.toLocaleString()}</p>
          <p className="text-xs text-neutral-500 mt-1">{pending.length} invoices</p>
        </div>
      </div>

      {/* Pending Payments Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl">
        <div className="px-5 py-4 border-b border-neutral-800">
          <h3 className="font-semibold text-white">Pending Payments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Invoice</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {pending.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-neutral-800/50">
                  <td className="px-5 py-4 text-sm text-white font-mono">{invoice.invoice_number}</td>
                  <td className="px-5 py-4 text-sm text-neutral-300">{invoice.customer_name}</td>
                  <td className="px-5 py-4 text-sm text-white font-semibold">E{(invoice.total_amount || 0).toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-400">Pending</span>
                  </td>
                </tr>
              ))}
              {pending.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-neutral-500">No pending payments</td>
                </tr>
              )}
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
      {/* Summary */}
      <div className="bg-neutral-900 border border-red-800/50 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="text-sm text-neutral-400 mb-1">Total Bad Debts</p>
            <p className="text-3xl font-bold text-red-400">E{totalBadDebts.toLocaleString()}</p>
            <p className="text-xs text-neutral-500 mt-1">{badDebts.length} overdue invoices</p>
          </div>
        </div>
      </div>

      {/* Bad Debts Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl">
        <div className="px-5 py-4 border-b border-neutral-800">
          <h3 className="font-semibold text-white">Overdue Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Invoice</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Vehicle</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {badDebts.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-neutral-800/50">
                  <td className="px-5 py-4 text-sm text-white font-mono">{invoice.invoice_number}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-white">{invoice.customer_name}</p>
                    <p className="text-xs text-neutral-500">{invoice.customer_email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-300">{invoice.vehicle_name}</td>
                  <td className="px-5 py-4 text-sm text-red-400 font-semibold">E{(invoice.total_amount || 0).toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm text-neutral-400">{new Date(invoice.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {badDebts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-green-400">No bad debts - Great!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
