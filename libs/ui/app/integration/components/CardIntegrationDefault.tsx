import React from "react"
import { CiCircleCheck } from "react-icons/ci"
import { RxCursorArrow } from "react-icons/rx"

import { Profile } from "@/types/profile"

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

export const CardIntegrationDefault = ({
  children,
  title,
  description,
  eventClick,
  id,
  titleBtn,
  disabled,
  commingSoon,
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
          disabled={disabled}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 ${
            disabled
              ? "cursor-not-allowed bg-slate-300 dark:bg-gray-400"
              : "bg-slate-300 dark:bg-black"
          }`}
        >
          {disabled && !commingSoon ? <CiCircleCheck /> : <RxCursorArrow />}
          <span>{titleBtn ? titleBtn : "Conectar"}</span>
        </button>
      </div>
    </div>
  )
}
