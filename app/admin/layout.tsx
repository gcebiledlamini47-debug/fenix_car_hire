import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  )
}
