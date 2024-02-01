import React from "react"
import { RxNotionLogo, RxRowSpacing } from "react-icons/rx"

import { CardIntegration } from "./components/CardIntegration"
import { ChatwootIcon } from "@/components/svg/integrations/ChatwootIcon"

export const Column = () => {
  const handleClick = () => {
    console.log("hola")
  }
  return (
    <div className="flex flex-wrap gap-4">
      <CardIntegration
        eventClick={handleClick}
        title="chatsappAI Connect"
        description="Conecta tus cuentas de Whatsapp a tus agentes de IA de chatsappAI. "
      >
        <ChatwootIcon />
      </CardIntegration>
    </div>
  )
}
