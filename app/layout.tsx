import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fenix Car Hire | Reliable Car Rental Service',
  description: 'Reliable, Professional, Convenient car rental service. Book your dream vehicle today.',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-[#F4F6F9]">
        {children}
      </body>
    </html>
  )
}
