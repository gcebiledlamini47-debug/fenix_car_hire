import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard | Fenix Car Hire",
  description: "Manage your car rental fleet",
  robots: "noindex, nofollow",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
