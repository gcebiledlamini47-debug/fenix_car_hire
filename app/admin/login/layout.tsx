import type { ReactNode } from 'react'

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-[#1a4a8d] to-[#0d2d5c]">
        {children}
      </body>
    </html>
  )
}
