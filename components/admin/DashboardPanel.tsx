"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Car, Calendar, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface Stats {
  totalVehicles: number
  availableVehicles: number
  bookedVehicles: number
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  unreadMessages: number
}

export function DashboardPanel() {
  const [stats, setStats] = useState<Stats>({
    totalVehicles: 0,
    availableVehicles: 0,
    bookedVehicles: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    unreadMessages: 0,
  })
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()

    // Fetch vehicles stats
    const { data: vehicles } = await supabase.from("vehicles").select("*")
    const totalVehicles = vehicles?.length || 0
    const bookedVehicles = vehicles?.filter((v) => v.is_booked).length || 0
    const availableVehicles = totalVehicles - bookedVehicles

    // Fetch bookings stats
    const { data: bookings } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
    const totalBookings = bookings?.length || 0
    const pendingBookings = bookings?.filter((b) => b.status === "pending").length || 0
    const confirmedBookings = bookings?.filter((b) => b.status === "confirmed").length || 0

    // Fetch messages stats
    const { data: messages } = await supabase.from("contact_messages").select("*")
    const unreadMessages = messages?.filter((m) => m.status === "unread").length || 0

    setStats({
      totalVehicles,
      availableVehicles,
      bookedVehicles,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      unreadMessages,
    })

    setRecentBookings(bookings?.slice(0, 5) || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a4a8d]"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Vehicles",
      value: stats.totalVehicles,
      icon: Car,
      color: "bg-blue-500",
    },
    {
      title: "Available",
      value: stats.availableVehicles,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Booked",
      value: stats.bookedVehicles,
      icon: Clock,
      color: "bg-orange-500",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      title: "Pending",
      value: stats.pendingBookings,
      icon: AlertCircle,
      color: "bg-yellow-500",
    },
    {
      title: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: "bg-red-500",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 md:p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          {recentBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No bookings yet
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Vehicle
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Dates
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.first_name} {booking.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{booking.email}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-gray-900">{booking.vehicle_name}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.pickup_date).toLocaleDateString()} -{" "}
                        {new Date(booking.return_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
