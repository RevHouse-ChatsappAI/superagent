"use client"

import { NavBar } from "@/components/NavBar"
import Sidebar from "@/components/sidebar"

import { ChatwootProvider } from "./context/ChatwootContext"

interface RootLayoutProps {
  children: React.ReactNode
  profile: any
}

export default function RootLayout({ children, profile }: RootLayoutProps) {
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
          <Sidebar />
          <div className="ml-[255px] mt-2 flex-1 overflow-auto">{children}</div>
        </div>
      </ChatwootProvider>
    </section>
  )
}
