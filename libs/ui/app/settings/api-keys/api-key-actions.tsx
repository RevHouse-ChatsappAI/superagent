"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ApiKey } from "@/models/models"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { RxTrash } from "react-icons/rx"
import { TbPencil } from "react-icons/tb"
import * as z from "zod"

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
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

interface ActionButtonProps {
  profile: any
  api_key: ApiKey
}

const DeleteButton = ({ profile, api_key }: ActionButtonProps) => {
  const api = new Api(profile?.api_key)
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)

  const onDeleteApiKey = async () => {
    await api.deleteApiKey(api_key.id)

    router.refresh()

    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <RxTrash size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar clave de API</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea eliminar esta clave API? Esta acción es
            irreversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={onDeleteApiKey} variant="destructive">
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
})

const EditButton = ({ profile, api_key }: ActionButtonProps) => {
  const api = new Api(profile?.api_key)
  const { toast } = useToast()
  const router = useRouter()

  const [dialogOpen, setDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await api.updateApiKey(api_key.id, values)

    if (!res?.success) {
      toast({
        title: "Error",
        description: "Se produjo un error al actualizar la clave API",
      })
      return
    }

    router.refresh()

    setDialogOpen(false)
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        form.reset()
        form.clearErrors()
        setDialogOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <TbPencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar clave API</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name">Nombre</Label>
                  <FormControl>
                    <Input
                      placeholder="Ingrese el nombre de la clave API"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-8">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button variant="default">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

const TableActions = (props: { profile: any; api_key: ApiKey }) => {
  return (
    <div className="space-x-1">
      <EditButton {...props} />
      <DeleteButton {...props} />
      <Toaster />
    </div>
  )
}

export default TableActions
