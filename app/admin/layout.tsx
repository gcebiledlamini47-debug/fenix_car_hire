'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check for token in both localStorage and cookies
    const storedToken = localStorage.getItem('admin_token')
    const cookieToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('admin_token='))
      ?.split('=')[1]
    
    const token = storedToken || cookieToken

    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login')
    } else if (token) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [pathname, router])

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }
    localStorage.removeItem('admin_token')
    document.cookie = 'admin_token=; path=/; max-age=0'
    router.push('/admin/login')
  }

  // Show login page without sidebar
  if (pathname === '/admin/login') {
    return (
      <html lang="en">
        <body className="bg-gray-900 text-white m-0 p-0">
          {children}
        </body>
      </html>
    )
  }

  if (!isMounted || isLoading) {
    return (
      <html lang="en">
        <body className="bg-gray-900 text-white m-0 p-0 flex items-center justify-center min-h-screen">
          <p className="text-gray-400">Loading...</p>
        </body>
      </html>
    )
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null
  }

  const navItems = [
    { href: '/admin/dash', label: 'Dashboard', icon: '📊' },
    { href: '/admin/bookings', label: 'Bookings', icon: '📅' },
    { href: '/admin/quotations', label: 'Quotations', icon: '📋' },
    { href: '/admin/invoices', label: 'Invoices', icon: '📄' },
    { href: '/admin/checksheets', label: 'Checksheets', icon: '✓' },
    { href: '/admin/messages', label: 'Messages', icon: '💬' },
    { href: '/admin/payments', label: 'Payments', icon: '💳' },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <html lang="en">
      <body className="bg-gray-900 text-white m-0 p-0">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col fixed h-screen overflow-y-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Fenix Admin
              </h1>
              <p className="text-gray-400 text-sm mt-1">Car Hire Management</p>
            </div>

            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="border-t border-gray-700 pt-4">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 ml-64 p-8 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

