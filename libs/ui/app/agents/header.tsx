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
      name: "My Agent",
      description: "",
      llmProvider: "AZURE_OPENAI",
      llmModel: "GPT_3_5_TURBO_16K_0613",
      isActive: true,
      prompt: "Eres un asistente de IA útil",
    })
    router.push(`/agents/${agent.id}`)
  })

  return (
    <div className="flex items-center justify-between px-6 py-3 font-medium">
      <span>Agents</span>
      <Button size="sm" className="space-x-2" onClick={createWorkflow}>
        {loading ? <Spinner /> : <TbPlus />}
        <span>Nuevo agente</span>
      </Button>
    </div>
  )
}
