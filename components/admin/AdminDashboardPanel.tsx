'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign, Users, Car, FileText } from "lucide-react"

interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  pendingQuotations: number
  availableVehicles: number
  totalVehicles: number
  recentBookings: Array<{ id: string; customer_name: string; status: string; created_at: string }>
}

export function AdminDashboardPanel() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total bookings
        const { count: bookingsCount } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })

        // Fetch revenue from invoices
        const { data: invoices } = await supabase
          .from("invoices")
          .select("total_amount")
          .eq("status", "paid")

        const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0

        // Fetch pending quotations
        const { count: quotationsCount } = await supabase
          .from("quotations")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending")

        // Fetch vehicle availability
        const { data: vehicles } = await supabase
          .from("vehicles")
          .select("is_booked")

        const availableVehicles = vehicles?.filter(v => !v.is_booked).length || 0
        const totalVehicles = vehicles?.length || 0

        // Fetch recent bookings
        const { data: recentBookings } = await supabase
          .from("bookings")
          .select("id, customer_name, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5)

        setStats({
          totalBookings: bookingsCount || 0,
          totalRevenue,
          pendingQuotations: quotationsCount || 0,
          availableVehicles,
          totalVehicles,
          recentBookings: recentBookings || [],
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-700 border-t-emerald-500"></div>
      </div>
    )
  }

  const StatCard = ({ icon: Icon, label, value, subtext, color }: any) => (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          label="Total Bookings"
          value={stats?.totalBookings || 0}
          subtext="All time"
          color="bg-blue-900/40"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`E${(stats?.totalRevenue || 0).toLocaleString()}`}
          subtext="From paid invoices"
          color="bg-emerald-900/40"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Quotes"
          value={stats?.pendingQuotations || 0}
          subtext="Awaiting response"
          color="bg-yellow-900/40"
        />
        <StatCard
          icon={Car}
          label="Fleet Status"
          value={`${stats?.availableVehicles}/${stats?.totalVehicles}`}
          subtext="Available vehicles"
          color="bg-purple-900/40"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-500" />
          Recent Bookings
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {stats?.recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4 text-white">{booking.customer_name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "confirmed" 
                        ? "bg-emerald-900/40 text-emerald-400"
                        : booking.status === "pending"
                        ? "bg-yellow-900/40 text-yellow-400"
                        : "bg-slate-700 text-slate-400"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-yellow-500">Secure Access</p>
          <p className="text-xs text-slate-400 mt-1">This portal is restricted to authorized personnel only. All actions are logged for security purposes.</p>
        </div>
      </div>
    </div>
  )
}
