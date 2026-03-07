"use client"

import { Menu, LogOut, User } from "lucide-react"

interface AdminHeaderProps {
  userEmail: string
  onLogout: () => void
  onMenuToggle: () => void
}

export function AdminHeader({ userEmail, onLogout, onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Admin Dashboard</h2>
            <p className="text-sm text-gray-500 hidden sm:block">Manage your fleet and bookings</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span className="max-w-[150px] truncate">{userEmail}</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
