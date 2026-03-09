import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Portal | Fenix Car Hire",
  description: "Private admin portal - unauthorized access prohibited",
  robots: "noindex, nofollow",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-slate-950 text-white">
        {children}
      </body>
    </html>
  )
}
