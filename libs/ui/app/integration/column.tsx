'use client'
import React, { useState } from "react"
import { RxCardStackPlus } from "react-icons/rx"

import { CardIntegration } from "./components/CardIntegration"
import { ChatwootIcon } from "@/components/svg/integrations/ChatwootIcon"
import { Modal } from "./components/Modal"
import { Profile } from "@/types/profile"
import { useChatwoot } from "../context/ChatwootContext"

export const Column = ({profile}: {profile: Profile}) => {
  const { tokenActive } = useChatwoot()

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
        disabled={tokenActive}
        isTokenActive={tokenActive}
        titleBtn={tokenActive ? 'Conectado' : 'Conectar'}
      >
        <ChatwootIcon />
      </CardIntegration>
      <CardIntegration
        eventClick={handleClick}
        title="WhatsApp Connect"
        description="Conecta tus cuentas de Whatsapp. "
        id="whatsapp"
        disabled={true}
        titleBtn="Próximamente"
        commingSoon={true}
      >
        <RxCardStackPlus className="text-4xl text-black" />
      </CardIntegration>
      {
        modal.integration === 'chatwoot' && <Modal isTokenActive={tokenActive} handleModalClose={onClose} profile={profile}/>
      }
    </div>
  )
}
