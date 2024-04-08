"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ApiKey } from "@/models/models"
import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { TbCopy } from "react-icons/tb"
import * as z from "zod"

import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { CodeBlock } from "@/components/codeblock"

const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
})

export function CreateSecretKey({ profile }: { profile: any }) {
  const api = new Api(profile?.api_key)

  const { toast } = useToast()
  const router = useRouter()
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [createApiKeyDialogOpen, setCreateApiKeyDialogOpen] = useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await api.createApiKey(values)

    if (!res?.success) {
      toast({
        title: "Error",
        description: "An error occured while creating the API key",
      })
      return
    }

    const apiKey = new ApiKey(res?.data)

    router.refresh()
    if (apiKey?.apiKey) setGeneratedKey(apiKey.apiKey)

    setCreateApiKeyDialogOpen(false)
  }

  return (
    <>
      {generatedKey && (
        <Dialog
          defaultOpen={true}
          onOpenChange={() => {
            setGeneratedKey(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clave de API</DialogTitle>
              <DialogDescription>
                Puede ver la clave de API una vez. Pero siempre puede crear una
                nueva.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-x-hidden">
              <div className="flex space-x-2">
                <Input
                  value={generatedKey}
                  readOnly
                  className="w-full"
                  placeholder="Generated API key"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedKey)
                    toast({
                      title: "API key copied to clipboard",
                    })
                  }}
                  variant="outline"
                >
                  <TbCopy />
                </Button>
              </div>

              <Tabs defaultValue="python">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="javascript">
                    Javascript/Typescript
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="python">
                  <CodeBlock
                    value={`from superagent.client import Superagent\n\nclient = Superagent(\n   token="${generatedKey}",\n   base_url="https://beta.chatsappai.com/" # o su entorno local\n)`}
                    language="python"
                  />
                </TabsContent>
                <TabsContent value="javascript">
                  <CodeBlock
                    value={`import {ClienteSuperAgente} from "superagentai-js";\n\nconst cliente = new ClienteSuperAgente({\n   token: "${generatedKey}", \n   entorno: "https://beta.chatsappai.com/" // o su entorno local \n});`}
                    language="javascript"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Dialog
        open={createApiKeyDialogOpen}
        onOpenChange={(open) => {
          setCreateApiKeyDialogOpen(open)
          form.clearErrors()
          form.reset()
        }}
      >
        <DialogTrigger asChild>
          <Button variant="default">
            <span className="mr-1 text-lg">+ </span> Crear una nueva clave API
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear una nueva clave API</DialogTitle>
            <DialogDescription>
              Esta clave API se utilizará para autenticar las solicitudes a la
              API.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Introduzca el nombre de la clave API"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" variant="default">
                  Crear clave API
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
  )
}
