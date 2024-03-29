import React, { useEffect, useState } from "react"
import { CiCircleCheck } from "react-icons/ci"
import { RxCursorArrow } from "react-icons/rx"

import { Profile } from "@/types/profile"

import { Api } from "@/lib/api"
import { BtnConecctionChatsAppAIExtend } from "./BtnConecctionChatwootExtend"

interface Props {
  children?: React.ReactNode
  title: string
  description: string
  id: string
  commingSoon?: boolean
  profile?: Profile
}

export const CardIntegrationExtendChatwoot = ({
  children,
  title,
  description,
  id,
  commingSoon,
  profile,
}: Props) => {
  const [isAvailableKey, setIsAvailableKey] = useState<boolean>()


  useEffect(() => {
    const api = new Api(profile?.api_key)
    const fetchData = async () => {
      try {
        const platformKeyData = await api.platformKey();
        setIsAvailableKey(platformKeyData.success)
      } catch (error) {
        console.error("Error al buscar la plataforma key", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, profile?.api_key]);

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
          {isAvailableKey ? <CiCircleCheck /> : <RxCursorArrow />}
          <span>{isAvailableKey ? "Habilitado" : "Conectar"}</span>
        </button>
        <BtnConecctionChatsAppAIExtend
          isTokenActive={false}
          profile={profile!}
          isAvailableExtendChatwoot={isAvailableKey}
          setIsAvailableKey={setIsAvailableKey}
        />
      </div>
    </div>
  )
}
