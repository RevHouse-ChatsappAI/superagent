"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { siteConfig } from "@/config/site"
import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const azureSchema = z.object({
  azure_endpoint: z.string().nonempty("El punto final no puede estar vacío"),
  openai_api_version: z
    .string()
    .nonempty("La versión de API no puede estar vacía"),
  azure_deployment: z
    .string()
    .nonempty("La implementación no puede estar vacía"),
})

const formSchema = z.object({
  apiKey: z.string().nonempty("La clave API es obligatoria"),
  options: azureSchema.optional(),
})

export default function LLM({
  profile,
  configuredLLMs,
}: {
  profile: any
  configuredLLMs: any
}) {
  const [open, setOpen] = React.useState<boolean>()
  const [selectedProvider, setSelectedProvider] = React.useState<any>()
  const router = useRouter()
  const api = new Api(profile.api_key)
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      ...values,
      options:
        Object.keys(values?.options ?? {}).length === 0
          ? undefined
          : values.options,
    }

    const isExistingConnection = configuredLLMs.find(
      (db: any) => db.provider === selectedProvider.provider
    )

    if (isExistingConnection) {
      await api.patchLLM(isExistingConnection.id, {
        ...payload,
        provider: selectedProvider.provider,
      })
    } else {
      await api.createLLM({ ...payload, provider: selectedProvider.provider })
    }

    form.reset()
    router.refresh()
    setOpen(false)
  }

  return (
    <div className="container flex max-w-4xl flex-col space-y-10 pt-10">
      <div className="flex flex-col">
        <p className="text-lg font-medium">Modelos de lenguaje</p>
        <p className="text-muted-foreground">
          Conéctese con su proveedor preferido de modelos de lenguaje.
        </p>
      </div>
      <div className="flex-col border-b">
        {siteConfig.llmForm.map((llm) => {
          const isConfigured = configuredLLMs.find(
            (db: any) => db.provider === llm.provider
          )

          return (
            <div
              className="flex items-center justify-between border-t py-4"
              key={llm.provider}
            >
              <div className="flex items-center space-x-4">
                {isConfigured ? (
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-muted" />
                )}
                <div className="flex items-center space-x-3">
                  <p className="font-medium">{llm.name}</p>
                </div>
              </div>
              <Button
                disabled={llm.disabled}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedProvider(llm)
                  setOpen(true)
                }}
              >
                Configuración
              </Button>
            </div>
          )
        })}
      </div>
      <Dialog
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            form.reset()
          }

          setOpen(isOpen)
        }}
        open={open}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProvider?.name}</DialogTitle>
            <DialogDescription>
              Conecta tu cuenta privada de {selectedProvider?.name} a
              ChatsAppAI.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                {selectedProvider?.metadata.map((metadataField: any) => (
                  <FormField
                    key={metadataField.key}
                    control={form.control}
                    name={metadataField.key}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{metadataField.label}</FormLabel>
                        {metadataField.type === "input" && (
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={
                                "placeholder" in metadataField
                                  ? metadataField.placeholder
                                  : ""
                              }
                              type="text"
                            />
                          </FormControl>
                        )}
                        {"helpText" in metadataField && (
                          <FormDescription className="pb-2">
                            {metadataField.helpText as string}
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">
                      Cerrar
                    </Button>
                  </DialogClose>
                  <Button type="submit" size="sm">
                    {form.control._formState.isSubmitting ? (
                      <Spinner />
                    ) : (
                      "Guardar"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
