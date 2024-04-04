import { NavBar } from "@/components/NavBar"
import Sidebar from "@/components/sidebar"

import BillingModal from "./billing-modal"

interface RootLayoutProps {
  children: React.ReactNode
  profile: any
}

export default function RootLayout({ children, profile }: RootLayoutProps) {
  return (
    <section className="flex h-screen flex-col">
      {/*
      {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
        <BillingModal profile={profile} />
      )}
      */}
      <NavBar />
      <div className="flex">
        <Sidebar />
        <div className="ml-16 flex-1 overflow-auto">{children}</div>
      </div>
    </section>
  )
}
