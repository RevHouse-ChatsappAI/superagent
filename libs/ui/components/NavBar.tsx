"use client"

import React, { useEffect, useState } from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTheme } from "next-themes"
import { useForm } from "react-hook-form"
import { FiSend } from "react-icons/fi"
import { IoMdSunny } from "react-icons/io"
import { PiHeadphones } from "react-icons/pi"
import { RiShareBoxFill } from "react-icons/ri"
import { useAsync } from "react-use"
import { z } from "zod"

import { Profile } from "@/types/profile"
import { getSupabase } from "@/lib/supabase"

import { DarkMode } from "./icons/DarkMode"
import { toast } from "./ui/use-toast"

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    required_error: "Please select a theme.",
  }),
})

type ThemeFormValues = z.infer<typeof appearanceFormSchema>
const supabase = getSupabase()

export const NavBar = () => {
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

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: theme ? (theme as "light" | "dark") : "light",
    },
  })

  function handleToggle(data: ThemeFormValues) {
    const { theme: selectedTheme } = data
    setTheme(selectedTheme)
    toast({
      description: "Tema actualizado",
    })
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  return (
    <nav
      className={`flex h-[60px] items-center justify-end gap-10 border-b px-6 py-3 ${
        !showSidebar && "hidden"
      }`}
    >
      <NextLink href="/settings" className="flex items-center gap-2">
        <PiHeadphones className="text-xl" />
        <span>Centro de ayuda</span>
      </NextLink>
      <NextLink
        target="_blank"
        href="https://app.chatsappai.com/"
        className="flex items-center gap-2"
      >
        <FiSend className="text-lg" />
        <span>CRM</span>
        <RiShareBoxFill className="text-lg" />
      </NextLink>
      <button
        type="button"
        onClick={() =>
          handleToggle({ theme: theme == "light" ? "dark" : "light" })
        }
        className={`rounded-lg p-2 transition-all hover:bg-slate-800 ${
          theme === "light" ? "bg-slate-900" : "bg-slate-900"
        }`}
      >
        {theme === "light" ? (
          <DarkMode />
        ) : (
          <IoMdSunny className="text-xl text-yellow-500" />
        )}
      </button>
    </nav>
  )
}
