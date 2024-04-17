"use client"

import React, { useState } from "react"

import Logo from "@/components/logo"
import { useChatwoot } from "@/app/context/ChatwootContext"

import { CardIntegration } from "./CardIntegration"

export const PlaltformExtend = ({ profile }: { profile: any }) => {
  const { tokenActive } = useChatwoot()

  const [modal, setModal] = useState({
    integration: "default",
  })
  const handleClick = (id: string) => {
    setModal({ integration: id })
  }

  return (
    <div className="pt-10">
      <CardIntegration
        eventClick={handleClick}
        title="ChatsappAI Connect"
        description="Conecta tus cuentas de Whatsapp a tus agentes de IA de chatsappAI a través de nuestra plataforma CRM. "
        id="chatwoot"
        disabled={tokenActive}
        isTokenActive={tokenActive}
        titleBtn={tokenActive ? "Habilitado" : "Conectar"}
        profile={profile}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
          <Logo />
        </div>
      </CardIntegration>
    </div>
  )
}
