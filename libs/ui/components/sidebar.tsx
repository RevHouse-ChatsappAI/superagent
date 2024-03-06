"use client"

import { useEffect, useState } from "react"
import NextLink from "next/link"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { FiExternalLink, FiMenu } from "react-icons/fi"
import { IoIosArrowForward } from "react-icons/io"
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
import { Api } from "@/lib/api"

export default function Sidebar() {
  const supabase = createClientComponentClient()
  const { value: showSidebar } = useAsync(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return false
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user?.id)
      .single()
    if (!profile.is_onboarded) {
      return false
    }

    return true
  }, [])

  useEffect(() => {
    if (session) {
      const api = new Api(session?.profile?.api_key)
      const interval = setInterval(async () => {
        const countResponse = await api?.getCount();
        if (countResponse.success) {
          setCount(countResponse.data);
        }
      }, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [session]);

  const pathname = usePathname()
  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <div
      className={`flex h-full w-16 flex-col items-center justify-between space-y-6 border-r bg-muted py-4 align-top ${
        !showSidebar && "hidden"
      }`}
    >
      <div
        className={`flex flex-col ${isCollapsed ? "gap-7" : "gap-2"} 2xl:gap-8`}
      >
        <div
          className={`flex ${isCollapsed ? 'flex-col' : 'items-center'} rounded-tr-lg border-b-2 bg-gray-500 px-1 py-2 dark:bg-transparent`}
        >
          <div className="flex justify-center">
            <ChatsAppLogoAI />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col text-white">
              <p className="text-sm">{session?.profile?.first_name}</p>
              <p className="text-xs text-gray-300 dark:text-gray-500">{count?.queryCount} /<strong> {credit?.credits}</strong> creditos</p>
            </div>
          )}
          {isCollapsed && (
            <div className="text-center text-xs text-white">0</div>
          )}
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
      {/* {!isCollapsed && (
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
      )} */}
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
        <div className="flex w-full items-center border-t">
          <button
            type="button"
            onClick={toggleSidebar}
            className="hover:bg-opacity/25 dark:hover:bg-opacity/25 mt-2 flex w-full items-center gap-2 rounded-lg p-3 text-xs transition-all hover:bg-black/25 hover:text-white dark:hover:bg-black"
          >
            <IoIosArrowForward className={`${isCollapsed ? 'rotate-0' : 'rotate-180'} transition-all`} />
            {!isCollapsed && <span>Ocultar Sidebar</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
