"use client"

import React from "react"
import NextLink from "next/link"
import { FiSend } from "react-icons/fi"
import { PiHeadphones } from "react-icons/pi"
import { RiShareBoxFill } from "react-icons/ri"

import { DarkMode } from "./icons/DarkMode"

export const NavBar = () => {
  return (
    <nav className="flex items-center justify-end gap-10 px-6 py-3">
      <NextLink href="/asdfsadf" className="flex items-center gap-2">
        <PiHeadphones className="text-xl" />
        <span>Centro de ayuda</span>
      </NextLink>
      <NextLink href="/asdfsadf" className="flex items-center gap-2">
        <FiSend className="text-lg" />
        <span>CRM</span>
        <RiShareBoxFill className="text-lg" />
      </NextLink>
      <button className="rounded-lg p-2 transition-all hover:bg-slate-100/30">
        <DarkMode />
      </button>
    </nav>
  )
}
