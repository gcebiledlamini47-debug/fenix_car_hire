'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { PrivateAdminSidebar } from "@/components/admin/PrivateAdminSidebar"
import { PrivateAdminHeader } from "@/components/admin/PrivateAdminHeader"
import { AdminDashboardPanel } from "@/components/admin/AdminDashboardPanel"
import { VehiclesPanel } from "@/components/admin/VehiclesPanel"
import { BookingsPanel } from "@/components/admin/BookingsPanel"
import { MessagesPanel } from "@/components/admin/MessagesPanel"
import { InvoicesPanel } from "@/components/admin/InvoicesPanel"
import { QuotationsPanel } from "@/components/admin/QuotationsPanel"
import { PaymentsPanel } from "@/components/admin/PaymentsPanel"
import { ReportsPanel } from "@/components/admin/ReportsPanel"
import type { User } from "@supabase/supabase-js"

export type AdminTab = "dashboard" | "vehicles" | "bookings" | "messages" | "invoices" | "quotations" | "payments" | "reports"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
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

      setUser(user)
      setLoading(false)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/fenix-admin/login")
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/fenix-admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-700 border-t-emerald-500"></div>
          <p className="text-slate-400">Loading admin portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex text-white">
      <PrivateAdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <PrivateAdminHeader
          userEmail={user?.email || ""}
          onLogout={handleLogout}
          onMenuToggle={() => setSidebarOpen(true)}
        />
        
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-gradient-to-b from-slate-900 to-slate-950">
          {activeTab === "dashboard" && <AdminDashboardPanel />}
          {activeTab === "vehicles" && <VehiclesPanel />}
          {activeTab === "bookings" && <BookingsPanel />}
          {activeTab === "messages" && <MessagesPanel />}
          {activeTab === "invoices" && <InvoicesPanel />}
          {activeTab === "quotations" && <QuotationsPanel />}
          {activeTab === "payments" && <PaymentsPanel />}
          {activeTab === "reports" && <ReportsPanel />}
        </main>
      </div>
    </div>
  )
}
