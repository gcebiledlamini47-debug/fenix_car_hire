'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react'

interface Report {
  totalBookings: number
  totalRevenue: number
  totalCustomers: number
  bookedVehicles: number
  availableVehicles: number
  pendingPayments: number
  completedBookings: number
  cancelledBookings: number
}

export function ReportsPanel() {
  const [report, setReport] = useState<Report>({
    totalBookings: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    bookedVehicles: 0,
    availableVehicles: 0,
    pendingPayments: 0,
    completedBookings: 0,
    cancelledBookings: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    setLoading(true)

    // Get all booking stats
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')

    const { data: vehicles } = await supabase
      .from('vehicles')
      .select('*')

    const { data: payments } = await supabase
      .from('payments')
      .select('*')

    if (bookings && vehicles && payments) {
      const bookedVehicles = vehicles.filter(v => v.is_booked).length
      const availableVehicles = vehicles.filter(v => !v.is_booked).length
      const totalRevenue = payments
        .filter(p => p.status === 'confirmed')
        .reduce((sum, p) => sum + p.amount, 0)
      const pendingPayments = payments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0)
      const completedBookings = bookings.filter(b => b.status === 'completed').length
      const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length

      setReport({
        totalBookings: bookings.length,
        totalRevenue,
        totalCustomers: new Set(bookings.map(b => b.customer_name)).size,
        bookedVehicles,
        availableVehicles,
        pendingPayments,
        completedBookings,
        cancelledBookings,
      })
    }

    setLoading(false)
  }

  if (loading) {
    return <div className="p-6 text-center">Loading report...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-8">
        <BarChart3 className="text-[#00A8E8]" size={28} />
        <h2 className="text-3xl font-bold text-[#1a4a8d]">Business Reports</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Bookings</p>
              <p className="text-4xl font-bold text-[#1a4a8d] mt-2">{report.totalBookings}</p>
            </div>
            <Calendar className="text-blue-500" size={40} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Revenue</p>
              <p className="text-4xl font-bold text-green-700 mt-2">E{report.totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="text-green-500" size={40} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Unique Customers</p>
              <p className="text-4xl font-bold text-purple-700 mt-2">{report.totalCustomers}</p>
            </div>
            <Users className="text-purple-500" size={40} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Pending Payments</p>
              <p className="text-4xl font-bold text-orange-700 mt-2">E{report.pendingPayments.toLocaleString()}</p>
            </div>
            <TrendingUp className="text-orange-500" size={40} />
          </div>
        </div>
      </div>

      {/* Vehicle Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-[#1a4a8d] mb-6">Fleet Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-700 font-semibold">Available Vehicles</p>
                <p className="text-2xl font-bold text-green-600">{report.availableVehicles}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(report.availableVehicles / (report.availableVehicles + report.bookedVehicles)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-700 font-semibold">Booked Vehicles</p>
                <p className="text-2xl font-bold text-red-600">{report.bookedVehicles}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(report.bookedVehicles / (report.availableVehicles + report.bookedVehicles)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-[#1a4a8d] mb-6">Booking Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <p className="text-gray-700 font-semibold">Completed Bookings</p>
              <p className="text-2xl font-bold text-green-600">{report.completedBookings}</p>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
              <p className="text-gray-700 font-semibold">Cancelled Bookings</p>
              <p className="text-2xl font-bold text-red-600">{report.cancelledBookings}</p>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700 font-semibold">Success Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {report.totalBookings > 0 ? Math.round((report.completedBookings / report.totalBookings) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-[#1a4a8d] mb-6">Quick Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-600 text-sm font-semibold">Avg Revenue per Booking</p>
            <p className="text-2xl font-bold text-[#00A8E8] mt-2">
              {report.totalBookings > 0 ? 'E' + (report.totalRevenue / report.totalBookings).toFixed(0) : 'E0'}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-gray-600 text-sm font-semibold">Fleet Utilization</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {report.availableVehicles + report.bookedVehicles > 0
                ? Math.round((report.bookedVehicles / (report.availableVehicles + report.bookedVehicles)) * 100)
                : 0}%
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-gray-600 text-sm font-semibold">Avg per Customer</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {report.totalCustomers > 0 ? 'E' + (report.totalRevenue / report.totalCustomers).toFixed(0) : 'E0'}
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-gray-600 text-sm font-semibold">Total Transactions</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {report.totalBookings + report.pendingPayments > 0 ? report.totalBookings : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
