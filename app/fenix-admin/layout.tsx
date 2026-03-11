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
  return <>{children}</>
}
