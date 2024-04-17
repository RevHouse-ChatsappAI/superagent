"use client"

import React from "react"
import { CiCircleCheck } from "react-icons/ci"
import { RxCommit, RxCursorArrow } from "react-icons/rx"

import { Profile } from "@/types/profile"

import { BtnConecctionChatsAppAI } from "./BtnConecctionChatsAppAI"

interface Props {
  children?: React.ReactNode
  title: string
  description: string
  eventClick: (id: string) => void
  id: string
  titleBtn?: string
  disabled?: boolean
  commingSoon?: boolean
  isTokenActive?: boolean
  profile?: Profile
}

export const CardIntegration = ({
  children,
  title,
  description,
  eventClick,
  id,
  titleBtn,
  disabled,
  commingSoon,
  isTokenActive,
  profile,
}: Props) => {
  return (
    <div
      className={`black:bg-white flex flex-col justify-between gap-3 rounded-2xl bg-slate-100 px-3 py-5 md:col-span-3 md:h-[252px] md:w-[272px] lg:col-span-3 xl:col-span-2 ${
        commingSoon ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {children}
          <h2 className="text-lg font-bold text-gray-600">{title}</h2>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="flex flex-col justify-center gap-2">
        <button
          disabled
          className={`flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-md bg-slate-300 px-4 py-2 dark:bg-gray-400`}
        >
          {disabled && !commingSoon ? <CiCircleCheck /> : <RxCursorArrow />}
          <span>{titleBtn ? titleBtn : "Conectar"}</span>
        </button>
        <BtnConecctionChatsAppAI
          isTokenActive={isTokenActive ?? false}
          profile={profile!}
          isAvailableExtendChatwoot={true}
        />
      </div>
    </div>
  )
}
