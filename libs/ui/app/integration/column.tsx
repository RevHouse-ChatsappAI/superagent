"use client"


import React, { useState } from "react"
import { BsWhatsapp } from "react-icons/bs"
import { GiPentarrowsTornado } from "react-icons/gi"
//Icons
import { SiMicrosoftazure } from "react-icons/si"

//Components
import { Profile } from "@/types/profile"
import { ChatwootIcon } from "@/components/svg/integrations/ChatwootIcon"

import { useChatwoot } from "../context/ChatwootContext"
import { CardIntegration } from "./components/CardIntegration"
import { Modal } from "./components/Modal"

export const Column = ({ profile }: { profile: Profile }) => {
  const { tokenActive } = useChatwoot()

  const [modal, setModal] = useState({
    integration: "default",
  })
  const handleClick = (id: string) => {
    setModal({ integration: id })
  }
  const onClose = () => {
    setModal({ integration: "default" })
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
        titleBtn={tokenActive ? "Habilitado" : "Conectar"}
        profile={profile}
      >
        <ChatwootIcon />
      </CardIntegration>
      <CardIntegration
        eventClick={handleClick}
        title="Pinecone"
        description="Pinecone te ayuda a construir y escalar tus aplicaciones de búsqueda vectorial con facilidad y rapidez."
        id="whatsapp"
        disabled={true}
        titleBtn="Habilitado"
      >
        <GiPentarrowsTornado className="text-4xl text-black" />
      </CardIntegration>
      <CardIntegration
        eventClick={handleClick}
        title="Azure OpenAI"
        description="Utiliza Azure OpenAI para potenciar tus asistentes con los últimos modelos de OpenAI."
        id="whatsapp"
        disabled={true}
        titleBtn="Habilitado"
      >
        <SiMicrosoftazure className="text-4xl text-black" />
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
        <BsWhatsapp className="text-4xl text-black" />
      </CardIntegration>
      {modal.integration === "chatwoot" && (
        <Modal
          isTokenActive={tokenActive}
          handleModalClose={onClose}
          profile={profile}
        />
      )}
    </div>
  )
}
