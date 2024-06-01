"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"

import { integrationsConfig } from "@/config/integration"
import { Button } from "@/components/ui/button"
import { useChatwoot } from "@/app/context/ChatwootContext"

import { BtnConecctionChatsAppAI } from "./BtnConecctionChatsAppAI"

export const PlatformExtend = ({ profile }: { profile: any }) => {
  const { tokenActive } = useChatwoot()

  return (
    <div className="container mt-5 flex max-w-4xl flex-col">
      <div className="flex flex-col">
        <p className="text-lg font-medium">Plataformas</p>
        <p className="mb-10 text-muted-foreground">
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
              <div className="rounded-full bg-green-500 p-2">
                <Image
                  src="/logo.png"
                  width="25"
                  height="25"
                  alt="ChatsAPP CRM"
                />
              </div>
              <p className="font-medium">ChatsAPP CRM</p>
            </div>
          </div>
          <BtnConecctionChatsAppAI
            profile={profile}
            isTokenActive={tokenActive}
          />
        </div>
      </div>
      {integrationsConfig.map((integration) => (
        <div className="flex-col border-b">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-green-500 p-2">
                  <Image
                    src="/logo.png"
                    width="25"
                    height="25"
                    alt={integration.name}
                  />
                </div>
                <p className="font-medium">{integration.name}</p>
              </div>
            </div>
            <Link
              href={`/integrations/${integration.id}`}
              className="flex items-center gap-2"
            >
              Conectar
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
