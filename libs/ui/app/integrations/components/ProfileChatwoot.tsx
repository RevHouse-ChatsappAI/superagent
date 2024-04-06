import React, { useState } from "react"
import { FaRegUser } from "react-icons/fa"
import { HiOutlineMail } from "react-icons/hi"

import { ProfileChatwoot as TypeProfile } from "@/types/profileChatwoot"
import { toast } from "@/components/ui/use-toast"

interface Props {
  profile?: TypeProfile
}

export const ProfileChatwoot = ({ profile }: Props) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        color: "green",
        description: "Copiado Exitosamente",
      })
    } catch (err) {
      toast({
        color: "red",
        description: "Fallo en la copia",
      })
    }
  }

  return (
    <div className="w-full p-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center rounded-sm bg-gray-700 p-2 text-sm text-gray-300">
          <FaRegUser className="mr-2 text-sm font-semibold text-gray-400" />
          <span>{profile?.available_name}</span>
        </div>
        <div className="relative flex items-center rounded-sm bg-gray-700 p-2 text-sm text-gray-300">
          <HiOutlineMail className="mr-2 text-sm font-semibold text-gray-400" />
          <span>{profile?.email}</span>
          <button
            className="absolute right-0 top-0 ml-2 rounded-tr-sm bg-gray-600 px-3 py-1 text-xs text-white transition-all hover:bg-gray-500 active:scale-95"
            onClick={() => copyToClipboard(profile?.email || "")}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}
