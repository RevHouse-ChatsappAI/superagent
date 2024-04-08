"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LLMProvider } from "@/models/models"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Agent } from "@/types/agent"
import { LLM } from "@/types/llm"
import { Profile } from "@/types/profile"
import { siteConfig } from "@/config/site"
import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

import AddDatasource from "./add-datasource"
import AddTool from "./add-tool"
import Avatar from "./avatar"

const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  initialMessage: z.string(),
  llms: z.string(),
  isActive: z.boolean().default(true),
  llmModel: z.string().nullable(),
  prompt: z.string(),
  tools: z.array(z.string()),
  datasources: z.array(z.string()),
  avatar: z.string().nullable(),
})

interface Datasource {
  id: string
  name: string
}

interface Tool {
  id: string
  name: string
}

interface SettingsProps {
  tools: Tool[]
  configuredLLMs: LLM[]
  agent: Agent
  profile: Profile
  datasources: Datasource[]
}

export default function Settings({
  agent,
  datasources,
  configuredLLMs,
  tools,
  profile,
}: SettingsProps) {
  console.log("agent", agent)
  const api = new Api(profile.api_key)
  const router = useRouter()
  const { toast } = useToast()
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: agent.description,
      initialMessage: agent.initialMessage || "",
      llms: agent.llms?.[0]?.llm.provider,
      llmModel: agent.llmModel,
      isActive: true,
      prompt: agent.prompt,
      tools: [],
      datasources: [],
      avatar: agent.avatar,
    },
  })
  const avatar = form.watch("avatar")
  const currLlmProvider = form.watch("llms") as LLMProvider
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { tools, datasources } = values

    const updateResources = async (
      originalIds: string[],
      newIds: string[],
      createResource: (id: string) => Promise<void>,
      deleteResource?: (id: string) => Promise<void>
    ) => {
      const resourcesToCreate = newIds.filter((id) => !originalIds.includes(id))
      const resourcesToRemove = originalIds.filter((id) => !newIds.includes(id))

      for (const resourceId of resourcesToCreate) {
        await createResource(resourceId)
      }

      for (const resourceId of resourcesToRemove) {
        if (deleteResource) {
          await deleteResource(resourceId)
        }
      }
    }

    try {
      await api.patchAgent(agent.id, values)

      const originalToolIds = agent.tools.map((tool: any) => tool.tool.id)
      await updateResources(
        originalToolIds,
        tools,
        (toolId) => api.createAgentTool(agent.id, toolId),
        (toolId) => api.deleteAgentTool(agent.id, toolId)
      )

      const originalDatasourceIds = agent.datasources.map(
        (datasource: any) => datasource.datasource.id
      )
      await updateResources(
        originalDatasourceIds,
        datasources,
        (datasourceId) => api.createAgentDatasource(agent.id, datasourceId),
        (datasourceId) => api.deleteAgentDatasource(agent.id, datasourceId)
      )

      if (currLlmProvider !== agent.llms?.[0]?.llm.provider) {
        const configuredLLM = configuredLLMs.find(
          (llm) => llm.provider === currLlmProvider
        )

        if (configuredLLM) {
          await api.deleteAgentLLM(agent.id, agent.llms?.[0]?.llm.id)
          await api.createAgentLLM(agent.id, configuredLLM.id)
        }
      }

      toast({
        description: "Agente Actualizado",
      })
      router.refresh()
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleUpload = React.useCallback(
    async (url: any) => {
      form.setValue("avatar", url)
    },
    [form]
  )

  return (
    <ScrollArea className="relative flex max-w-lg flex-1 grow px-4 py-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 px-2 pb-20"
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Por ejemplo, asistente para detalles de autos"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instrucciones</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-[400px]"
                    placeholder="Por ejemplo, eres un asistente de inteligencia artificial que..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="initialMessage"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>Mensaje Introductorio</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Por ejemplo, Hola, ¿en qué puedo ayudarte?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col space-y-2">
            {agent.llms.length > 0 ? (
              <div className="flex justify-between space-x-2">
                <FormField
                  control={form.control}
                  name="llms"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un proveedor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {siteConfig.llms
                            .filter(({ id }) =>
                              configuredLLMs.some((llm) => llm.provider === id)
                            )
                            .map(({ id, name }) => (
                              <SelectItem key={id} value={id}>
                                {name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="llmModel"
                  render={({ field }) => (
                    <FormItem className="hidden flex-1">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un modelo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {siteConfig.llms
                            .find((llm) => llm.id === currLlmProvider)
                            ?.options.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.title}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <div className="flex flex-col space-y-4 rounded-lg border border-red-500 p-4">
                <p className="text-sm">¡Atención!</p>
                <p className="text-sm text-muted-foreground">
                  Necesitas añadir un Modelo de Lenguaje a este agente para que
                  funcione. Esto se puede hacer a través del SDK o la API.
                </p>
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="tools"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>APIs + Herramientas</FormLabel>
                  <AddTool
                    profile={profile}
                    agent={agent}
                    onSuccess={() => {
                      window.location.reload()
                    }}
                  />
                </div>

                <FormControl>
                  <MultiSelect
                    placeholder="Selecciona una herramienta..."
                    data={tools.map((tool: any) => ({
                      value: tool.id,
                      label: tool.name,
                    }))}
                    onChange={(values: { value: string }[]) => {
                      field.onChange(values.map(({ value }) => value))
                    }}
                    selectedValues={agent.tools.map((tool: any) => ({
                      value: tool.tool.id,
                      label: tool.tool.name,
                    }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="datasources"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Fuentes de datos</FormLabel>
                  <AddDatasource
                    profile={profile}
                    agent={agent}
                    llmProvider={currLlmProvider}
                    onSuccess={() => {
                      window.location.reload()
                    }}
                  />
                </div>
                <FormControl>
                  <MultiSelect
                    placeholder="Selecciona fuentes de datos..."
                    data={datasources.map((datasource: Datasource) => ({
                      value: datasource.id,
                      label: datasource.name,
                    }))}
                    onChange={(values: { value: string }[]) => {
                      field.onChange(values.map(({ value }) => value))
                    }}
                    selectedValues={agent.datasources.map(
                      (datasource: any) => ({
                        value: datasource.datasource.id,
                        label: datasource.datasource.name,
                      })
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="absolute inset-x-5 bottom-2 flex py-4">
            <Button
              type="submit"
              size="sm"
              className="w-full"
              variant="secondary"
            >
              {form.control._formState.isSubmitting ? (
                <Spinner />
              ) : (
                "Actualizar agente"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <Toaster />
    </ScrollArea>
  )
}
