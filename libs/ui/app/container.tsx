import { NavBar } from "@/components/NavBar"
import Sidebar from "@/components/sidebar"
import WidgetComponent from "@/components/widget"

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
      <WidgetComponent />
      <div className="flex flex-1 flex-col">
        <NavBar />
        <div className="overflow-auto">{children}</div>
      </div>
    </section>
  )
}
