"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Eye, X, Check, Clock, XCircle, Search, Filter } from "lucide-react"

interface Booking {
  id: string
  vehicle_id: string
  vehicle_name: string
  pickup_date: string
  return_date: string
  pickup_location: string
  return_location: string
  first_name: string
  last_name: string
  email: string
  phone: string
  driver_license: string
  status: string
  notes: string
  created_at: string
}

export function BookingsPanel() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
    setBookings(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    await supabase.from("bookings").update({ status }).eq("id", id)
    
    // If confirmed, mark vehicle as booked
    if (status === "confirmed") {
      const booking = bookings.find((b) => b.id === id)
      if (booking?.vehicle_id) {
        await supabase
          .from("vehicles")
          .update({ is_booked: true })
          .eq("id", booking.vehicle_id)
      }
    }
    
    // If cancelled or completed, mark vehicle as available
    if (status === "cancelled" || status === "completed") {
      const booking = bookings.find((b) => b.id === id)
      if (booking?.vehicle_id) {
        await supabase
          .from("vehicles")
          .update({ is_booked: false })
          .eq("id", booking.vehicle_id)
      }
    }
    
    fetchBookings()
    if (selectedBooking?.id === id) {
      setSelectedBooking({ ...selectedBooking, status })
    }
  }

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicle_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a4a8d]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Manage Bookings</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent outline-none w-full sm:w-auto"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent outline-none appearance-none bg-white w-full sm:w-auto"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No bookings found
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
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Dates
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.first_name} {booking.last_name}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-[150px]">
                        {booking.email}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                      <div className="text-sm text-gray-900">{booking.vehicle_name}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden lg:table-cell">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.pickup_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        to {new Date(booking.return_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(booking.id, "confirmed")}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Confirm booking"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateStatus(booking.id, "cancelled")}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel booking"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => updateStatus(booking.id, "completed")}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Mark as completed"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                    selectedBooking.status
                  )}`}
                >
                  {selectedBooking.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(selectedBooking.created_at).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Customer Name</label>
                  <p className="font-medium">
                    {selectedBooking.first_name} {selectedBooking.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Email</label>
                  <p className="font-medium break-all">{selectedBooking.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Phone</label>
                  <p className="font-medium">{selectedBooking.phone}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">License</label>
                  <p className="font-medium">{selectedBooking.driver_license}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="text-xs text-gray-500 uppercase">Vehicle</label>
                <p className="font-medium text-lg">{selectedBooking.vehicle_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Pickup Date</label>
                  <p className="font-medium">
                    {new Date(selectedBooking.pickup_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Return Date</label>
                  <p className="font-medium">
                    {new Date(selectedBooking.return_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Pickup Location</label>
                  <p className="font-medium">{selectedBooking.pickup_location}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Return Location</label>
                  <p className="font-medium">{selectedBooking.return_location}</p>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="border-t pt-4">
                  <label className="text-xs text-gray-500 uppercase">Notes</label>
                  <p className="text-gray-700">{selectedBooking.notes}</p>
                </div>
              )}

              {selectedBooking.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => updateStatus(selectedBooking.id, "confirmed")}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Confirm
                  </button>
                  <button
                    onClick={() => updateStatus(selectedBooking.id, "cancelled")}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}

              {selectedBooking.status === "confirmed" && (
                <div className="pt-4 border-t">
                  <button
                    onClick={() => updateStatus(selectedBooking.id, "completed")}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
