import "@/styles/globals.css"

import { Metadata } from "next"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import PostHogClient from "@/lib/posthog"
import { cn } from "@/lib/utils"
import Analytics from "@/components/analytics"
import { ChatsAppAI } from "@/components/svg/ChatsAppAI"
import { ThemeProvider } from "@/components/theme-provider"

import Container from "./container"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export const dynamic = "force-dynamic"

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = createServerComponentClient({ cookies })

  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    PostHogClient()
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", session?.user.id)
    .single()

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col overflow-hidden">
              <div className="flex flex-1">
                {!session && (
                  <div className="flex w-1/2 flex-col justify-between border-r-2 border-white bg-slate-400 p-2 dark:bg-slate-900 md:p-10">
                    <ChatsAppAI />
                    <p className="w-[80%]">
                      “Los Agentes de IA nos ahorraron mas de 1000 horas de
                      trabajo manual en solo un mes, una locura para una empresa
                      como la nuestra.”Martin David
                    </p>
                  </div>
                )}
                <div className={session ? "flex-1" : "w-1/2"}>
                  <Container profile={profile}>{children}</Container>
                </div>
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
      <Analytics />
    </>
  )
}
