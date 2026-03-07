import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fenix Car Hire | Reliable Car Rental Service',
  description: 'Reliable, Professional, Convenient car rental service. Book your dream vehicle today.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
