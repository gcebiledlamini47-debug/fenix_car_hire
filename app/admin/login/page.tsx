'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: loginError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single()

      if (loginError || !data) {
        setError('Invalid email or password')
        setLoading(false)
        return
      }

      // For demo purposes, compare password directly
      // In production, use proper bcrypt comparison
      if (data.password_hash !== password) {
        setError('Invalid email or password')
        setLoading(false)
        return
      }

      // Set auth cookie
      document.cookie = `admin_token=${data.id}; path=/; max-age=86400`
      router.push('/admin/dashboard')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a4a8d] to-[#00A8E8]">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#00A8E8] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1a4a8d]">Fenix Admin</h1>
          <p className="text-gray-600 mt-2">Car Hire Management Portal</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
              placeholder="admin@fenix.co.sz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#00A8E8] text-white rounded-lg font-semibold hover:bg-[#0087b8] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-gray-700">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Email: admin@fenix.co.sz</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  )
}
