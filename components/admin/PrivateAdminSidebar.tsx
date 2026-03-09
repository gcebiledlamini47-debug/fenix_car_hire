'use client'

import { X, LayoutDashboard, Car, Calendar, MessageSquare, Receipt, FileText, CreditCard, BarChart3, Lock } from "lucide-react"
import type { AdminTab } from "@/app/fenix-admin/page"

interface PrivateAdminSidebarProps {
  activeTab: AdminTab
  setActiveTab: (tab: AdminTab) => void
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { id: "dashboard" as AdminTab, label: "Dashboard", icon: LayoutDashboard },
  { id: "vehicles" as AdminTab, label: "Fleet", icon: Car },
  { id: "bookings" as AdminTab, label: "Reservations", icon: Calendar },
  { id: "messages" as AdminTab, label: "Inquiries", icon: MessageSquare },
  { id: "quotations" as AdminTab, label: "Quotes", icon: FileText },
  { id: "invoices" as AdminTab, label: "Invoices", icon: Receipt },
  { id: "payments" as AdminTab, label: "Payments", icon: CreditCard },
  { id: "reports" as AdminTab, label: "Analytics", icon: BarChart3 },
]

export function PrivateAdminSidebar({ activeTab, setActiveTab, isOpen, onClose }: PrivateAdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 z-50 lg:z-auto lg:transform-none ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        {/* Header */}
        <div className="h-20 border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-emerald-500" />
            <div>
              <h1 className="font-bold text-white">ADMIN</h1>
              <p className="text-xs text-slate-400">Private Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id)
                      onClose()
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4 text-xs text-slate-500">
          <p>Access restricted to authorized personnel only</p>
        </div>
      </aside>
    </>
  )
}
