'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign, Users, Car, FileText, Bell, Send, X } from "lucide-react"

interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  pendingQuotations: number
  availableVehicles: number
  totalVehicles: number
  unreadMessages: number
  recentBookings: Array<{ id: string; customer_name: string; status: string; created_at: string }>
}

interface Message {
  id: string
  name: string
  email: string
  phone: string
  message: string
  is_read: boolean
  created_at: string
}

export function AdminDashboardPanel() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [responseText, setResponseText] = useState("")
  const [sending, setSending] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchStats()
    setupRealtimeListener()
  }, [supabase])

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

      // Fetch unread messages
      const { data: messages } = await supabase
        .from("contact_messages")
        .select("*")
        .eq("is_read", false)
        .order("created_at", { ascending: false })

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
        unreadMessages: messages?.length || 0,
        recentBookings: recentBookings || [],
      })

      setUnreadMessages(messages || [])
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeListener = () => {
    const channel = supabase
      .channel("contact_messages_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, () => {
        fetchStats()
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }

  const handleSendResponse = async () => {
    if (!selectedMessage || !responseText.trim()) return

    setSending(true)
    try {
      // Here you would typically send an email to the customer
      // For now, we'll just mark the message as read
      await supabase
        .from("contact_messages")
        .update({ is_read: true, response: responseText })
        .eq("id", selectedMessage.id)

      // Refresh the data
      await fetchStats()
      setSelectedMessage(null)
      setResponseText("")
    } catch (error) {
      console.error("Error sending response:", error)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-700 border-t-emerald-500"></div>
      </div>
    )
  }

  const StatCard = ({ icon: Icon, label, value, subtext, color, highlight }: any) => (
    <div className={`bg-gradient-to-br rounded-lg border p-6 hover:border-slate-600 transition-all duration-200 ${
      highlight ? "ring-2 ring-red-500 ring-offset-2 ring-offset-slate-950" : "border-slate-700"
    } ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        <div className="p-3 rounded-lg bg-slate-700/50">
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
          color="from-blue-900/40 to-blue-800/20 border-blue-700/30"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`E${(stats?.totalRevenue || 0).toLocaleString()}`}
          subtext="From paid invoices"
          color="from-emerald-900/40 to-emerald-800/20 border-emerald-700/30"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Quotes"
          value={stats?.pendingQuotations || 0}
          subtext="Awaiting response"
          color="from-yellow-900/40 to-yellow-800/20 border-yellow-700/30"
          highlight={stats?.pendingQuotations! > 0}
        />
        <StatCard
          icon={Car}
          label="Fleet Status"
          value={`${stats?.availableVehicles}/${stats?.totalVehicles}`}
          subtext="Available vehicles"
          color="from-purple-900/40 to-purple-800/20 border-purple-700/30"
        />
      </div>

      {/* Messages and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unread Messages with Real-time Notification */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Bell className={`w-5 h-5 ${unreadMessages.length > 0 ? "text-red-500 animate-pulse" : "text-slate-500"}`} />
            Customer Messages
            {unreadMessages.length > 0 && (
              <span className="ml-auto bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                {unreadMessages.length} New
              </span>
            )}
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {unreadMessages.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No unread messages</p>
            ) : (
              unreadMessages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedMessage?.id === msg.id
                      ? "bg-red-900/30 border-red-500"
                      : "border-slate-700 hover:border-slate-600 bg-slate-700/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-semibold">{msg.name}</p>
                      <p className="text-slate-400 text-sm">{msg.email}</p>
                    </div>
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  </div>
                  <p className="text-slate-300 text-sm mt-2 line-clamp-2">{msg.message}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Recent Bookings */}
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
                    <td className="py-3 px-4 text-white text-sm">{booking.customer_name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        booking.status === "confirmed" 
                          ? "bg-emerald-900/40 text-emerald-400"
                          : booking.status === "pending"
                          ? "bg-yellow-900/40 text-yellow-400"
                          : "bg-slate-700 text-slate-400"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Message Response Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white">Respond to {selectedMessage.name}</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Email</p>
                <p className="text-white font-medium">{selectedMessage.email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Customer Message</p>
                <p className="text-slate-200 bg-slate-800/50 p-3 rounded">{selectedMessage.message}</p>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Your Response</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  rows={4}
                  placeholder="Type your response..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="flex-1 px-4 py-2 border border-slate-700 text-slate-400 rounded hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendResponse}
                  disabled={sending || !responseText.trim()}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sending ? "Sending..." : "Send Response"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
