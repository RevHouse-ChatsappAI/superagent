"use client"

import { useState } from "react"
import NextLink from "next/link"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BsLayoutSidebarInset } from "react-icons/bs"
import { FaRegPlayCircle } from "react-icons/fa"
import { IoIosClose, IoMdSettings } from "react-icons/io"
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
  const [toggleModal, setToggleModal] = useState<Boolean>(true)

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

  const handleToggleModal = () => {
    console.log(toggleModal)
    setToggleModal(() => !toggleModal)
  }

  return (
    <div
      className={`scrollbar-thin scrollbar-thumb-gray-400 bg-muted ${
        toggleModal ? "!w-[70px]" : "!w-[250px]"
      } flex flex-col justify-between space-y-6 overflow-auto rounded-r-2xl border border-gray-700 py-4 align-top ${
        !showSidebar && "hidden"
      }`}
      style={{ scrollbarWidth: "thin", overflow: "auto" }}
    >
      <div className="flex flex-col justify-center space-y-4">
        <div className="border-b border-gray-500/40 px-4 pb-2">
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 p-3 text-white">
            <div
              className={`${
                toggleModal
                  ? ""
                  : "flex h-8 w-8 items-center justify-center rounded-full bg-gray-500"
              }`}
            >
              <p className="font-medium uppercase">
                {profile?.first_name.slice(0, 1)}
              </p>
            </div>
            {!toggleModal && (
              <div className="flex w-full flex-1 items-center justify-between gap-2">
                <div className="flex flex-col">
                  <h2 className="text-sm font-medium">{profile?.first_name}</h2>
                  <p className="text-xs font-light">{profile?.company}</p>
                </div>
                <div className="border-l border-gray-400 p-3">
                  <Link href="/settings">
                    <IoMdSettings className="text-2xl transition-all hover:rotate-45 hover:transition-all" />
                  </Link>
                </div>
              </div>
            )}
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
                  : " text-black hover:bg-slate-600/50 dark:text-white"
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
              {!toggleModal && (
                <p className="text-sm font-medium">{navItem.title}</p>
              )}
            </NextLink>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center space-y-2 px-4 align-bottom">
        {!toggleModal && (
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
        )}
        <div
          className={`${
            !toggleModal
              ? "flex items-center justify-center gap-5 p-2 "
              : "flex items-center justify-center p-2"
          }`}
        >
          <div className="flex items-center gap-2">
            {!toggleModal && (
              <>
                <Logo width={20} height={20} />
                <span className="-mb-05 mt-0.5 text-xs font-medium">
                  Chatsappai.com
                </span>
              </>
            )}
          </div>
          <button
            type="button"
            className="h-[20px] w-[20px]"
            onClick={handleToggleModal}
          >
            <BsLayoutSidebarInset />
          </button>
        </div>
      </div>
    </div>
  )
}
