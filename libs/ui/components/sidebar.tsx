"use client"

import { useState } from "react"
import NextLink from "next/link"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { FiExternalLink, FiMenu } from "react-icons/fi"
import { TbPremiumRights } from "react-icons/tb"
import { useAsync } from "react-use"

import {
  apiBaseNav,
  helpBaseNav,
  knowledgeBaseNav,
  workspaceNav,
} from "@/config/aside"

import { ChatsAppAI } from "./svg/ChatsAppAI"
import { ChatsAppLogoAI } from "./svg/ChatsAppLogoAI"
import { ButtonSidebar } from "./ui/buttonSidebar"

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const supabase = createClientComponentClient()
  const { value: session } = useAsync(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  }, [])
  const pathname = usePathname()

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <div
      className={`dark:bg-white-100 flex h-full ${
        isCollapsed ? "w-[50px]" : "w-[200px]"
      } flex-col justify-between space-y-3 rounded-r-2xl border-r bg-slate-100 pb-4 align-top ${
        !session && "hidden"
      }`}
    >
      <div
        className={`flex flex-col ${isCollapsed ? "gap-7" : "gap-2"} 2xl:gap-8`}
      >
        <div
          onClick={toggleSidebar}
          className="flex cursor-pointer items-center justify-center rounded-tr-lg border-b-2 bg-gray-500 p-2 dark:bg-transparent"
        >
          {isCollapsed ? <ChatsAppLogoAI /> : <ChatsAppAI />}
        </div>
        <div
          className={`flex flex-col ${
            isCollapsed ? "items-center" : "items-start"
          } px-2`}
        >
          {!isCollapsed && (
            <h2 className="px-2 text-xs dark:text-gray-300">
              {workspaceNav.title}
            </h2>
          )}
          {workspaceNav.items.map((navItem) => (
            <NextLink
              href={navItem.href}
              key={navItem.title}
              {...(navItem.title === "CRM" && { target: "_blank" })}
            >
              <ButtonSidebar
                variant={pathname.includes(navItem.href) ? "active" : "ghost"}
                size="icon"
                className={`group relative flex h-8 w-full items-center justify-center gap-2 px-3 dark:text-white ${
                  isCollapsed && pathname.includes(navItem.href)
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "bg-transparent"
                }`}
              >
                <div className="flex items-center justify-center">
                  <navItem.icon
                    className={`${isCollapsed ? "text-lg" : "text-sm"}`}
                  />
                  {!isCollapsed && (
                    <span className="ml-2 text-xs">{navItem.title}</span>
                  )}
                  {navItem.title === "CRM" && !isCollapsed && (
                    <FiExternalLink className="ml-1 text-xs 2xl:text-lg" />
                  )}
                </div>
                {isCollapsed && (
                  <span className="invisible absolute left-full top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded border-2 bg-black px-2 py-1 text-xs text-white shadow-lg group-hover:visible dark:bg-white dark:text-black">
                    {navItem.title}
                  </span>
                )}
              </ButtonSidebar>
            </NextLink>
          ))}
        </div>
        <div
          className={`flex flex-col ${
            isCollapsed ? "items-center" : "items-start"
          } px-2`}
        >
          {!isCollapsed && (
            <h2 className="px-2 text-xs dark:text-gray-300">
              {knowledgeBaseNav.title}
            </h2>
          )}
          {knowledgeBaseNav.items.map((navItem) => (
            <NextLink href={navItem.href} key={navItem.title}>
              <ButtonSidebar
                variant={pathname.includes(navItem.href) ? "active" : "ghost"}
                size="icon"
                className={`group relative flex h-8 w-full items-center justify-center gap-2 px-3 dark:text-white ${
                  isCollapsed && pathname.includes(navItem.href)
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "bg-transparent"
                }`}
              >
                <div className="flex items-center justify-center">
                  <navItem.icon
                    className={`${isCollapsed ? "text-lg" : "text-sm"}`}
                  />
                  {!isCollapsed && (
                    <span className="ml-2 text-xs">{navItem.title}</span>
                  )}
                </div>
                {isCollapsed && (
                  <span className="invisible absolute left-full top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded border-2 bg-black px-2 py-1 text-xs text-white shadow-lg group-hover:visible dark:bg-white dark:text-black">
                    {navItem.title}
                  </span>
                )}
              </ButtonSidebar>
            </NextLink>
          ))}
        </div>
        <div
          className={`flex flex-col ${
            isCollapsed ? "items-center" : "items-start"
          } px-2`}
        >
          {!isCollapsed && (
            <h2 className="px-2 text-xs dark:text-gray-300">
              {apiBaseNav.title}
            </h2>
          )}
          {apiBaseNav.items.map((navItem) => (
            <NextLink href={navItem.href} key={navItem.title}>
              <ButtonSidebar
                variant={pathname.includes(navItem.href) ? "active" : "ghost"}
                size="icon"
                className={`group relative flex h-8 w-full items-center justify-center gap-2 px-3 dark:text-white ${
                  isCollapsed && pathname.includes(navItem.href)
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "bg-transparent"
                }`}
              >
                <div className="flex items-center justify-center">
                  <navItem.icon
                    className={`${isCollapsed ? "text-lg" : "text-sm"}`}
                  />
                  {!isCollapsed && (
                    <span className="ml-2 text-xs">{navItem.title}</span>
                  )}
                  {navItem.title === "CRM" && !isCollapsed && (
                    <FiExternalLink className="ml-1 text-xs 2xl:text-lg" />
                  )}
                </div>
                {isCollapsed && (
                  <span className="invisible absolute left-full top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded border-2 bg-black px-2 py-1 text-xs text-white shadow-lg group-hover:visible dark:bg-white dark:text-black">
                    {navItem.title}
                  </span>
                )}
              </ButtonSidebar>
            </NextLink>
          ))}
        </div>
      </div>
      {!isCollapsed && (
        <div>
          <div className="mb-3 flex flex-col gap-1 px-4 2xl:mb-10 2xl:gap-3">
            <h2 className="text-xs 2xl:text-base dark:text-gray-300">Uso</h2>
            <div>
              <p className="text-xs dark:text-gray-300">Caracteres usados</p>
              <span className="text-xs 2xl:text-base">0 / 1.00M</span>
            </div>
            <div>
              <p className="text-xs dark:text-gray-300">Mensajes sobrantes</p>
              <span className="text-xs 2xl:text-base">1000</span>
            </div>
            <button className="text-start text-xs text-green-600 2xl:text-base dark:text-green-500">
              Manejar plan
            </button>
          </div>
        </div>
      )}
      <div
        className={`flex flex-col ${
          isCollapsed ? "items-center" : "items-start"
        } px-2`}
      >
        {!isCollapsed && (
          <h2 className="px-1 text-xs dark:text-gray-300">
            {helpBaseNav.title}
          </h2>
        )}
        {helpBaseNav.items.map((navItem) => (
          <NextLink href={navItem.href} key={navItem.title}>
            <ButtonSidebar
              variant={pathname.includes(navItem.href) ? "active" : "ghost"}
              size="icon"
              className={`group relative flex h-8 w-full items-center justify-center gap-2 px-3 dark:text-white ${
                isCollapsed && pathname.includes(navItem.href)
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "bg-transparent"
              }`}
            >
              <div className="flex items-center justify-center">
                <navItem.icon
                  className={`${isCollapsed ? "text-lg" : "text-sm"}`}
                />
                {!isCollapsed && (
                  <span className="ml-2 text-xs">{navItem.title}</span>
                )}
                {navItem.title === "CRM" && !isCollapsed && (
                  <FiExternalLink className="ml-1 text-xs 2xl:text-lg" />
                )}
              </div>
              {isCollapsed && (
                <span className="invisible absolute left-full top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded border-2 bg-black px-2 py-1 text-xs text-white shadow-lg group-hover:visible dark:bg-white dark:text-black">
                  {navItem.title}
                </span>
              )}
            </ButtonSidebar>
          </NextLink>
        ))}
      </div>
      {/* <div className="my-2 flex px-2 2xl:p-2">
        <Link
          href="/pricing"
          className={`w-full rounded-md border-2 py-2 transition-all duration-500 ease-in-out focus:outline-none ${
            isCollapsed ? "flex items-center justify-center" : "flex flex-col items-center gap-2 px-4"
          }`}
          style={{
            border: "2px solid #2563EF",
            background: "linear-gradient(45deg, #3B82F6, #2563EB)",
            color: "#fff",
            fontSize: isCollapsed ? "0" : "0.775rem",
            fontWeight: "500",
          }}
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
          <TbPremiumRights className="text-lg" />
          {!isCollapsed && <span>Actualiza a premium</span>}
        </Link>
      </div> */}
    </div>
  )
}
