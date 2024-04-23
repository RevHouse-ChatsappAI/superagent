"use client"

import React from "react"
import Image from "next/image"

import { useChatwoot } from "@/app/context/ChatwootContext"

import { BtnConecctionChatsAppAI } from "./BtnConecctionChatsAppAI"

export const Platform = ({ profile }: { profile: any }) => {
  const { tokenActive } = useChatwoot()

  return (
    <div className="container mt-2 flex max-w-4xl flex-col space-y-10">
      <div className="flex flex-col">
        <p className="text-lg font-medium">Plataformas</p>
        <p className="text-muted-foreground">
          Conecta fácilmente con tus sistemas y administra todos tus datos en un
          solo lugar. Nuestra plataforma te ofrece la simplicidad y seguridad
          que necesitas para llevar tu negocio al siguiente nivel. ¡Empieza
          ahora!
        </p>
      </div>
      <div className="flex-col border-b">
        <div className="flex items-center justify-between border-t py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Image src="" width="40" height="40" alt="ChatsAPP CRM" />
              <p className="font-medium">ChatsAPP CRM</p>
            </div>
          </div>
          <BtnConecctionChatsAppAI
            profile={profile}
            isTokenActive={tokenActive}
          />
        </div>
      </div>
    </div>
  )
}
