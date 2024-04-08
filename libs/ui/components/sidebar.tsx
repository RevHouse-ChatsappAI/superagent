"use client"

import { useState } from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { BsLayoutSidebarInset } from "react-icons/bs"
import { FaRegPlayCircle } from "react-icons/fa"
import { IoIosClose } from "react-icons/io"
import { useAsync } from "react-use"

import { Profile } from "@/types/profile"
import { siteConfig } from "@/config/site"
import { getSupabase } from "@/lib/supabase"

import { Agents } from "./icons/Agents"
import Logo from "./logo"
import { Button } from "./ui/button"

const supabase = getSupabase()

export default function Sidebar() {
  const [profile, setProfile] = useState<Profile | null>()

  const [closeModal, setCloseModal] = useState<Boolean>(false)

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
    setProfile(profile)

    return true
  }, [])
  const pathname = usePathname()

  const handleClose = () => {
    setCloseModal(true)
  }

  return (
    <div
      className={`fixed inset-y-0 flex h-full w-[245px] flex-col justify-between space-y-6 rounded-r-2xl border border-gray-700 bg-muted py-4 align-top${
        !showSidebar && "hidden"
      }`}
    >
      <div className="flex flex-col justify-center space-y-4">
        <div className="border-b border-gray-500/40 px-4 pb-2">
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 p-3 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
              <p>{profile?.first_name.slice(0, 1)}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium">{profile?.first_name}</h2>
              <p className="text-xs font-light">{profile?.company}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2 px-4">
          {siteConfig.mainNav.map((navItem) => (
            <NextLink
              href={navItem.href}
              key={navItem.title}
              className={`flex items-center gap-1 rounded-lg transition-all ${
                pathname.includes(navItem.href)
                  ? "bg-slate-900 text-white dark:bg-slate-900"
                  : "hover:bg-slate-600/50"
              }`}
            >
              <Button
                className={`${
                  pathname.includes(navItem.href)
                    ? "text-white"
                    : "text-black dark:text-white"
                } bg-transparent hover:bg-transparent`}
                size="icon"
              >
                <navItem.icon size={20} />
              </Button>
              <p className="text-sm font-medium">{navItem.title}</p>
            </NextLink>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center space-y-2 px-4 align-bottom">
        <div
          className={`relative flex flex-col items-center justify-center gap-2 rounded-lg bg-slate-900 p-4 ${
            closeModal && "hidden"
          }`}
        >
          <button
            type="button"
            className="absolute end-2 top-2 rounded-full bg-slate-400/50 transition-all hover:bg-gray-50/20"
            onClick={handleClose}
          >
            <IoIosClose />
          </button>
          <Agents />
          <h2 className="text-center text-xs font-medium text-white">
            Te presentamos los Agentes Inteligencia Artificial
          </h2>
          <p className="text-center text-xs font-light text-gray-400">
            La IA ha madurado como para reemplazar su fuerza laboral
          </p>
          <Button className="flex items-center gap-2 text-xs">
            <FaRegPlayCircle />
            <span>Mirar una Demo</span>
          </Button>
        </div>
        <div className="flex items-center justify-center gap-5 p-2">
          <div className="flex items-center gap-2">
            <Logo width={20} height={20} />
            <NextLink href="/settings" className="text-xs font-medium">
              Chatsappai.com
            </NextLink>
          </div>
          <button>
            <BsLayoutSidebarInset />
          </button>
        </div>
      </div>
    </div>
  )
}
