'use client'
import React, { useState } from "react"
import { RxCardStackPlus } from "react-icons/rx"

import { CardIntegration } from "./components/CardIntegration"
import { ChatwootIcon } from "@/components/svg/integrations/ChatwootIcon"
import { Modal } from "./components/Modal"
import { Profile } from "@/types/profile"

export const Column = ({profile}: {profile: Profile}) => {
  const [modal, setModal] = useState({
    integration: 'default'
  })
  const handleClick = (id: string) => {
    setModal({ integration: id })
  }
  const onClose = () => {
    setModal({integration: 'default'})
  }

  return (
    <div className="flex flex-wrap gap-4">
      <CardIntegration
        eventClick={handleClick}
        title="ChatsappAI Connect"
        description="Conecta tus cuentas de Whatsapp a tus agentes de IA de chatsappAI. "
        id="chatwoot"
      >
        <ChatwootIcon />
      </CardIntegration>
      <CardIntegration
        eventClick={handleClick}
        title="WhatsApp Connect"
        description="Conecta tus cuentas de Whatsapp. "
        id="whatsapp"
        disabled={true}
      >
        <RxCardStackPlus className="text-4xl text-black" />
      </CardIntegration>
      {
        modal.integration === 'chatwoot' && <Modal handleModalClose={onClose} profile={profile}/>
      }
    </div>
  )
}
