import { usePathname } from "next/navigation"

import { NavBar } from "@/components/NavBar"
import Sidebar from "@/components/sidebar"

interface RootLayoutProps {
  children: React.ReactNode
  profile: any
  session: any
}

export default function RootLayout({
  children,
  profile,
  session,
}: RootLayoutProps) {
  return (
    <section className="flex flex-col">
      {/*
          {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
            <BillingModal profile={profile} />
            )}
          */}
      <NavBar />
      <div className="flex">
        <Sidebar />
        <div
          className={`${
            session ? "ml-[255px]" : "ml-[0px]"
          } mt-2 flex-1 overflow-auto`}
        >
          {children}
        </div>
      </div>
    </section>
  )
}
