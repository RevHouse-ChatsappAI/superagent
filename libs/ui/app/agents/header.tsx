"use client"

import { useRouter } from "next/navigation"
import { TbPlus } from "react-icons/tb"
import { useAsyncFn } from "react-use"

import { Profile } from "@/types/profile"
import { initialSamlValue } from "@/config/saml"
import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function Header({ profile }: { profile: Profile }) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const [{ loading }, createWorkflow] = useAsyncFn(async () => {
    const { data: agent } = await api.createAgent({
      name: "Mi agente",
      description: "",
      llmProvider: "AZURE_OPENAI",
      llmModel: "GPT_4_1106_PREVIEW",
      isActive: true,
      prompt: "Eres un asistente de IA útil",
    })
    router.push(`/agents/${agent.id}`)
  })

  return (
    <div className="flex items-center justify-between px-6 py-3 font-medium">
      <div className="flex-1">
        <h2 className="text-2xl">Agentes</h2>
        <p className="w-3/4 text-sm font-light text-gray-500 dark:text-gray-300">
          En esta sección, tendrás acceso a la visualización y gestión de todos
          tus agentes de IA creados, los cuales están preparados para ser
          integrados en sistemas CRM y facilitar la interacción diaria con tus
          clientes.
        </p>
      </div>
      <div>
        <Button size="sm" className="space-x-2" onClick={createWorkflow}>
          {loading ? <Spinner /> : <TbPlus />}
          <span>Nuevo agente</span>
        </Button>
      </div>
    </div>
  )
}
