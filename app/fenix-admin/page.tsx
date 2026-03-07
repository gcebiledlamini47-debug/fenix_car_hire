"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { VehiclesPanel } from "@/components/admin/VehiclesPanel"
import { BookingsPanel } from "@/components/admin/BookingsPanel"
import { MessagesPanel } from "@/components/admin/MessagesPanel"
import { DashboardPanel } from "@/components/admin/DashboardPanel"

export type AdminTab = "dashboard" | "vehicles" | "bookings" | "messages"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/fenix-admin/login")
        return
      }

      const { data: adminData } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", user.email)
        .single()

      if (!adminData) {
        await supabase.auth.signOut()
        router.push("/fenix-admin/login")
        return
      }

      setUser({ email: user.email || "" })
      setLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/fenix-admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a4a8d]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <AdminHeader
          userEmail={user?.email || ""}
          onLogout={handleLogout}
          onMenuToggle={() => setSidebarOpen(true)}
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {activeTab === "dashboard" && <DashboardPanel />}
          {activeTab === "vehicles" && <VehiclesPanel />}
          {activeTab === "bookings" && <BookingsPanel />}
          {activeTab === "messages" && <MessagesPanel />}
        </main>
      </div>
    </div>
  )
}
