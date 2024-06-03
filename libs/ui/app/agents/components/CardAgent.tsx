import React from "react"
import { useRouter } from "next/navigation"
import { ActivityIcon, CpuIcon } from "lucide-react"

import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import Avatar from "../[agentId]/avatar"

export const CardAgent = ({
  agent,
  profile,
}: {
  agent: any
  profile: Profile
}) => {
  const api = React.useMemo(() => new Api(profile.api_key), [profile.api_key])
  const router = useRouter()

  const [imageURL, setImageURL] = React.useState("")

  const handleUpload = React.useCallback(
    async (url: string, agent: any): Promise<void> => {
      const {
        initialMessage,
        llms,
        llmModel,
        isActive,
        prompt,
        tools,
        datasources,
        avatar,
        ...agentData
      } = agent
      await api.patchAgent(agent.id, {
        avatar: url,
        initialMessage,
        llms,
        llmModel,
        isActive,
        prompt,
        tools,
        datasources,
      })
      setImageURL(url)
    },
    [api]
  )

  return (
    <Card className="flex flex-col justify-between overflow-hidden rounded-xl border-2 bg-slate-200 px-4 shadow-xl dark:bg-neutral-900">
      <div>
        <h2 className="pt-2 text-lg font-bold text-neutral-900 dark:text-neutral-50">
          {agent.name}
        </h2>
      </div>
      <div className="flex items-center justify-center py-3">
        <Avatar
          accept=".jpg, .jpeg, .png"
          onSelect={async (e: string) => {
            await handleUpload(e, agent)
          }}
          imageUrl={imageURL || agent.avatar || "/logo.png"}
        />
      </div>
      <div className="relative"></div>
      <CardContent className="flex flex-col justify-between !px-0 ">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge
              className="border-primary bg-primary-foreground text-primary dark:border-primary-foreground dark:bg-primary dark:text-primary-foreground"
              variant="outline"
            >
              <ActivityIcon className="h-4 w-4 -translate-x-1" />
              {agent.isActive ? <span>Activo</span> : <span>Inactivo</span>}
            </Badge>
            <Badge
              className="border-primary bg-primary-foreground text-primary dark:border-primary-foreground dark:bg-primary dark:text-primary-foreground"
              variant="outline"
            >
              <CpuIcon className="h-4 w-4 -translate-x-1" />
              {agent.llmModel.slice(0, 5)}
            </Badge>
          </div>
          <p className="text-left text-sm text-neutral-700 dark:text-neutral-300">
            {agent.description}
          </p>
        </div>
        <div className="mt-8 flex flex-1 justify-center">
          <Button
            onClick={() => router.push(`/agents/${agent.id}`)}
            className="w-full rounded-lg border border-primary bg-transparent px-8 py-4 text-sm font-semibold text-primary hover:bg-primary hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
            variant="default"
          >
            Ingresar al Agente
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
