import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { siteConfig } from "@/config/site"
import { Api } from "@/lib/api"
import { Alert } from "@/components/ui/alert"
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

export const Platform = ({ profile }: { profile: any }) => {
  const [open, setOpen] = React.useState<boolean>()
  const [selectedDB, setSelectedDB] = React.useState<any>()
  const router = useRouter()
  const api = new Api(profile.api_key)
  const { ...form } = useForm<any>({
    defaultValues: {
      options: {},
    },
  })

  async function onSubmit(values: any) {
    console.log(values)
    const payload = {
      ...values,
      options:
        Object.keys(values.options).length === 0 ? undefined : values.options,
    }

    console.log(payload)

    form.reset()
    router.refresh()
    setOpen(false)
  }

  return (
    <div className="container mt-2 flex max-w-4xl flex-col space-y-10">
      <div className="flex flex-col">
        <p className="text-lg font-medium">Plataformas</p>
        <p className="text-muted-foreground">
          Conecta fácilmente con tus sistemas y administra todos tus datos en un
          solo lugar. Nuestra plataforma te ofrece la simplicidad y seguridad
          que necesitas para llevar tu negocio al siguiente nivel. ¡Empieza
          ahora!
        </p>
      </div>
      <div className="flex-col border-b">
        {siteConfig.platformProvider.map((platform) => {
          return (
            <div
              className="flex items-center justify-between border-t py-4"
              key={platform.provider}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Image
                    src={platform.logo}
                    width="40"
                    height="40"
                    alt={platform.name}
                  />
                  <p className="font-medium">{platform.name}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDB(platform)
                  setOpen(true)
                }}
              >
                Settings
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
            <DialogTitle>{selectedDB?.name}</DialogTitle>
            <DialogDescription>
              <Alert
                variant="default"
                className="border-blue-400 text-blue-300"
              >
                {selectedDB?.description}
              </Alert>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                {selectedDB?.metadata.map((metadataField: any) => (
                  <FormField
                    key={metadataField.key}
                    control={form.control}
                    // @ts-ignore
                    name={`options.${metadataField.key}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{metadataField.label}</FormLabel>
                        {metadataField.type === "input" && (
                          <FormControl>
                            {/* @ts-ignore */}
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
                      "Guardar Configuración"
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
