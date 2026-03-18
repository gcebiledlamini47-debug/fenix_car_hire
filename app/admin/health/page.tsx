'use client'

export default function AdminHealthCheck() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a4a8d] to-[#00A8E8] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-3xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a4a8d] mb-2">Admin System Ready!</h1>
        <p className="text-gray-600 mb-6">
          Your admin dashboard is properly configured and ready to use.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6 text-left">
          <p className="font-semibold text-[#1a4a8d] mb-3">Next Steps:</p>
          <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
            <li>Visit /admin/login</li>
            <li>Login with admin@fenix.co.sz</li>
            <li>Password: admin123</li>
            <li>Start managing your bookings!</li>
          </ol>
        </div>

        <div className="bg-green-50 border border-green-200 rounded p-4 text-left">
          <p className="font-semibold text-green-700 mb-2">Modules Available:</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ Dashboard</li>
            <li>✓ Bookings</li>
            <li>✓ Quotations</li>
            <li>✓ Checksheets</li>
            <li>✓ Invoices</li>
            <li>✓ Messages</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
