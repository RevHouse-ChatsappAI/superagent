// Componente StepOne.jsx
import React, { useMemo, useState } from "react"
import { useAsync } from "react-use"

import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { Spinner } from "@/components/ui/spinner"
import { useChatwoot } from "@/app/context/ChatwootContext"

import { ButtonPrev } from "../btn/ButtonPrev"

interface StepOneProps {
  nextStep: () => void
  prevStep: () => void
  btnPrevActive?: boolean
  profile: Profile
}

const StepThree = ({
  nextStep,
  prevStep,
  profile,
  btnPrevActive = true,
}: StepOneProps) => {
  //State
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
    llmModel: "GPT_3_5_TURBO_16K_0613",
    isActive: true,
    tools: [],
    datasources: [],
    prompt: "You are an helpful AI Assistant",
  })

  //Context
  const { apiAgent, handleAgentApi } = useChatwoot()

  //API
  const api = useMemo(() => new Api(profile.api_key), [profile.api_key])

  //Function
  const { value: agents, error: agentsError } = useAsync(async () => {
    const response = await api.getAgents({
      skip: 0,
      take: 10,
    })
    if (response.error) {
      throw new Error(response.error)
    }
    return response.data
  }, [])

  const handleAddUserChatwoot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      //Create Agent SuperAgent
      let agent
      try {
        const agentResponse = await api.createAgent({ ...form })
        agent = agentResponse.data
      } catch (error: any) {
        if (error.response && error.response.status === 500) {
          console.error(
            "Agent creation encountered an error but may still have been created:",
            error
          )
        } else {
          throw error
        }
      }
      const apiAgent = agent.id

      if (agent && agent.id) {
        handleAgentApi(apiAgent)
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

  const [modalActiveAgent, setModalActiveAgent] = useState(true)

  return (
    <div className="flex flex-1 flex-col">
      <button
        type="button"
        className="mb-4 rounded bg-gray-300 px-4 py-2 text-sm text-black transition-all hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        onClick={() => setModalActiveAgent(!modalActiveAgent)}
      >
        {modalActiveAgent ? "Ya tengo un agente" : "Crear un nuevo agente"}
      </button>
      {modalActiveAgent ? (
        <>
          <h2 className="mb-4 text-sm text-gray-700 dark:text-gray-300">
            Creación de Agente ChatsAppAI
          </h2>
          <form
            onSubmit={handleAddUserChatwoot}
            className={`flex flex-1 flex-col justify-between ${apiAgent ? 'pointer-events-none opacity-50' : ''}`}
          >
            <div className="flex flex-col gap-4">
              <label className="flex w-full flex-col gap-1">
                <p className="text-sm text-gray-900 dark:text-gray-300">Nombre del agente</p>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-transparent p-2 text-sm text-gray-900 placeholder:text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:placeholder:text-gray-400"
                  placeholder="Ej: Asistente Carlos Carniceria"
                  required
                  disabled={!!apiAgent}
                />
              </label>
              <label className="flex w-full flex-col gap-1">
                <p className="text-sm text-gray-900 dark:text-gray-300">Description</p>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-transparent p-2 text-sm text-gray-900 placeholder:text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:placeholder:text-gray-400"
                  placeholder="Ej: Agente de soporte técnico para clientes VIP"
                  required
                  disabled={!!apiAgent}
                />
              </label>
            </div>
            <div
              className={`mt-5 flex items-center ${
                btnPrevActive ? "justify-between" : "justify-end"
              }`}
            >
              {btnPrevActive && (
                <ButtonPrev title="Previo" prevStep={prevStep} />
              )}
              <button
                type="submit"
                className={`rounded bg-blue-500 px-4 py-2 text-sm text-white transition-all hover:bg-blue-400 ${loading || !!apiAgent ? 'cursor-not-allowed' : ''} dark:hover:bg-blue-600`}
                disabled={loading || !!apiAgent}
              >
                {loading ? <Spinner /> : "Crear Agent SuperAgent"}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div>
          <h2 className="mb-4 text-sm text-gray-700 dark:text-gray-300">
            Selecciona un agente:
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {agents?.map(
              (agent: { id: string; name: string; description: string }) => (
                <div
                  key={agent.id}
                  className={`flex h-20 cursor-pointer flex-col items-center justify-center rounded-lg bg-slate-300 p-4 shadow transition-opacity duration-300 ease-in-out dark:bg-gray-700 ${
                    apiAgent && apiAgent !== agent.id
                      ? "opacity-50"
                      : "opacity-100"
                  }`}
                  onClick={() => {
                    const newApiAgent = apiAgent === agent.id ? "" : agent.id;
                    handleAgentApi(newApiAgent);
                  }}
                >
                  <p
                    className={`text-sm font-medium ${
                      apiAgent === agent.id ? "text-blue-600" : "text-gray-800"
                    } dark:text-gray-300`}
                  >
                    {agent.name}
                  </p>
                </div>
              )
            )}
          </div>
          {apiAgent && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="rounded bg-blue-500 px-4 py-2 text-sm text-white transition-all hover:bg-blue-400 dark:hover:bg-blue-600"
                onClick={() => nextStep()}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StepThree
