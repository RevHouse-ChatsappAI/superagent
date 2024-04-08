"use client"

import React, { useEffect, useState } from "react"
import NextLink from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTheme } from "next-themes"
import { useForm } from "react-hook-form"
import { FiSend } from "react-icons/fi"
import { PiHeadphones } from "react-icons/pi"
import { RiShareBoxFill } from "react-icons/ri"
import { z } from "zod"

import { DarkMode } from "./icons/DarkMode"
import { toast } from "./ui/use-toast"

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    required_error: "Please select a theme.",
  }),
})

type ThemeFormValues = z.infer<typeof appearanceFormSchema>

export const NavBar = () => {
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
    <nav className="flex items-center justify-end gap-10 px-6 py-3">
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
        className="rounded-lg bg-slate-900 p-2 transition-all hover:bg-slate-800 dark:bg-transparent dark:hover:bg-slate-100/30"
      >
        <DarkMode />
      </button>
    </nav>
  )
}
