"use client"

// Componente StepOne.jsx
import React, { useState } from "react"
import { MdNavigateNext } from "react-icons/md"

import { ApiChatwootPlatform } from "@/lib/api_chatwoot"
import { Spinner } from "@/components/ui/spinner"
import { useChatwoot } from "@/app/context/ChatwootContext"

import { ButtonPrev } from "../btn/ButtonPrev"

interface StepOneProps {
  nextStep: () => void
  prevStep: () => void
}

const StepFour = ({ nextStep, prevStep }: StepOneProps) => {
  //Context
  const { userProfileChatwoot, apiAgent, accountId, handleTokenChange } =
    useChatwoot()

  //State
  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState(() => {
    const savedAccount = localStorage.getItem("agent_bot")
    return savedAccount || ""
  })
  const apiChatwoot = new ApiChatwootPlatform()

  //Function

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAccount = e.target.value
    setAccount(newAccount)
    localStorage.setItem("agent_bot", newAccount)
  }

  const handleAddUserChatwoot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      //Agent Bot Details
      const agent_bot_name = account
      const agent_bot_description = "Agent Bot By ChatsAppAI"
      const agent_bot_url = `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/webhook/${apiAgent}/chatwoot`

      //Create bot agent chatwoot
      const agentBotDetails = {
        name: agent_bot_name,
        description: agent_bot_description,
        outgoing_url: agent_bot_url,
        account_id: accountId,
      }
      const agentBotResponse = await apiChatwoot.createAgentBot(agentBotDetails)

      if (agentBotResponse) {
        handleTokenChange(agentBotResponse.access_token)
        nextStep()
        return
      }

      throw new Error("Fallo en la creación de la cuenta.")
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <h2 className="mb-2 text-sm dark:text-gray-500">
        Configuración del Agente Bot de Chatwoot
      </h2>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Este Agente Bot actuará como intermediario para conectar a los usuarios
        con nuestro agente de inteligencia artificial, facilitando una
        comunicación fluida y eficiente a través del CRM de ChatsappAI.
      </p>
      <form
        className="mt-5 flex flex-1 flex-col justify-between"
        onSubmit={handleAddUserChatwoot}
      >
        <label className="flex w-full flex-col gap-1">
          <p className="text-sm">Nombre del Agente Bot: </p>
          <input
            type="text"
            name="name"
            value={account}
            onChange={handleAccountChange}
            className="w-full rounded-lg border border-gray-300 bg-transparent p-2 text-sm text-gray-900 placeholder:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
            placeholder="Eg: Account Company"
            required
          />
        </label>
        <div className="mt-3 flex items-center justify-between">
          <ButtonPrev title="Previo" prevStep={prevStep} />
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-sm text-white transition-all hover:bg-blue-400"
            disabled={loading}
          >
            {loading ? <Spinner /> : <MdNavigateNext />}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StepFour
