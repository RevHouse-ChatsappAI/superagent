"use client"

import { usePathname } from "next/navigation"

import { NavBar } from "@/components/NavBar"
import Sidebar from "@/components/sidebar"

import { ChatwootProvider } from "./context/ChatwootContext"

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
  const pathname = usePathname()
  const isOnboarding = pathname.includes("/onboarding")
  const isPricing = pathname.includes("/pricing")

  console.log(isOnboarding)
  return (
    <section className="flex flex-col">
      <ChatwootProvider>
        {/*
          {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
            <BillingModal profile={profile} />
          )}
      */}
        <NavBar />
        <div className="flex">
          {session && !isOnboarding && <Sidebar />}
          <div
            className={`${
              session && !isOnboarding ? "ml-[255px]" : "ml-[0px]"
            } mt-2 flex-1 overflow-auto`}
          >
            {children}
          </div>
        </div>
      </ChatwootProvider>
    </section>
  )
}
