"use client"

import NextLink from "next/link"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAsync } from "react-use"

import {
  apiBaseNav,
  helpBaseNav,
  knowledgeBaseNav,
  workspaceNav,
} from "@/config/aside"
import { siteConfig } from "@/config/site"

import { ChatsAppAI } from "./svg/ChatsAppAI"
import { Button } from "./ui/button"
import { ButtonSidebar } from "./ui/buttonSidebar"
import { Separator } from "./ui/separator"

export default function Sidebar() {
  const supabase = createClientComponentClient()
  const { value: session } = useAsync(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  }, [])
  const pathname = usePathname()

  return (
    <div
      className={`bg-white-100 flex h-full w-[200px] flex-col justify-between space-y-3 rounded-r-2xl border-r py-4 align-top ${
        !session && "hidden"
      }`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-center">
          <ChatsAppAI />
        </div>
        <Separator />
        <div className="flex flex-col px-2">
          <p className="px-2 text-xs text-gray-300">{workspaceNav.title}</p>
          {workspaceNav.items.map((navItem) => (
            <NextLink href={navItem.href} key={navItem.title}>
              <ButtonSidebar
                variant={pathname.includes(navItem.href) ? "active" : "ghost"}
                size="icon"
                className="flex w-full items-center justify-start bg-transparent px-3 text-white"
              >
                <navItem.icon size={20} className="mr-2" />
                <span className="text-xs">{navItem.title}</span>
              </ButtonSidebar>
            </NextLink>
          ))}
        </div>
        <div>
          <p className="px-4 text-xs text-gray-300">{knowledgeBaseNav.title}</p>
          <div className="flex flex-col px-2">
            {knowledgeBaseNav.items.map((navItem) => (
              <NextLink href={navItem.href} key={navItem.title}>
                <ButtonSidebar
                  variant={pathname.includes(navItem.href) ? "active" : "ghost"}
                  size="icon"
                  className="flex w-full items-center justify-start bg-transparent px-3 text-white"
                >
                  <navItem.icon size={20} className="mr-2" />
                  <span className="text-xs">{navItem.title}</span>
                </ButtonSidebar>
              </NextLink>
            ))}
          </div>
        </div>
        <div>
          <p className="px-4 text-xs text-gray-300">{apiBaseNav.title}</p>
          <div className="flex flex-col px-2">
            {apiBaseNav.items.map((navItem) => (
              <NextLink href={navItem.href} key={navItem.title}>
                <ButtonSidebar
                  variant={pathname.includes(navItem.href) ? "active" : "ghost"}
                  size="icon"
                  className="flex w-full items-center justify-start bg-transparent px-3 text-white"
                >
                  <navItem.icon size={20} className="mr-2" />
                  <span className="text-xs">{navItem.title}</span>
                </ButtonSidebar>
              </NextLink>
            ))}
          </div>
        </div>
      </div>
      <div className="px-2">
        <Link
          href="/pricing"
          style={{
            width: "100%",
            borderRadius: "0.375rem",
            border: "2px solid #2563EB",
            padding: "1rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "#fff",
            background: "linear-gradient(45deg, #3B82F6, #2563EB)",
            transition: "background 0.5s ease-in-out, border 0.5s ease-in-out",
          }}
          className="w-full focus:outline-none"
          onMouseOver={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(45deg, #1D4ED8, #2563EB)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(45deg, #3B82F6, #2563EB)")
          }
          onFocus={(e) =>
            (e.currentTarget.style.boxShadow = "0 0 0 2px #60A5FA")
          }
        >
          Actualiza a premium
        </Link>
      </div>
      <div>
        <p className="px-4 text-xs text-gray-300">{helpBaseNav.title}</p>
        <div className="flex flex-col px-2">
          {helpBaseNav.items.map((navItem) => (
            <NextLink href={navItem.href} key={navItem.title}>
              <ButtonSidebar
                variant={pathname.includes(navItem.href) ? "active" : "ghost"}
                size="icon"
                className="flex w-full items-center justify-start bg-transparent px-3 text-white"
              >
                <navItem.icon size={20} className="mr-2" />
                <span className="text-xs">{navItem.title}</span>
              </ButtonSidebar>
            </NextLink>
          ))}
        </div>
      </div>
    </div>
  )
}
