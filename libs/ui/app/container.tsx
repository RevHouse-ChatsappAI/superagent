import { NavBar } from "@/components/NavBar"
import Sidebar from "@/components/sidebar"

interface RootLayoutProps {
  children: React.ReactNode
  profile: any
}

export default function RootLayout({ children, profile }: RootLayoutProps) {
  return (
    <section className="flex h-screen">
      {/*
          {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
            <BillingModal profile={profile} />
            )}
          */}
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <NavBar />
        <div
          style={{ height: "calc(100vh - 80px)" }}
          className="mt-2 overflow-auto"
        >
          {children}
        </div>
      </div>
    </section>
  )
}
