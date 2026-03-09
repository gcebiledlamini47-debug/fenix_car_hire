'use client'

import { Menu, LogOut, User, Clock } from "lucide-react"
import { useState, useEffect } from "react"

interface PrivateAdminHeaderProps {
  userEmail: string
  onLogout: () => void
  onMenuToggle: () => void
}

export function PrivateAdminHeader({ userEmail, onLogout, onMenuToggle }: PrivateAdminHeaderProps) {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 md:px-8 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-400" />
          </button>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white">Fenix Admin Portal</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <Clock className="w-4 h-4" />
              <span>{currentTime}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
            <User className="w-4 h-4 text-emerald-500" />
            <div className="text-right">
              <p className="text-xs text-slate-400">Logged in as</p>
              <p className="text-sm font-medium text-white truncate max-w-[200px]">{userEmail}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-red-700/30 text-red-500 hover:bg-red-900/40 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
