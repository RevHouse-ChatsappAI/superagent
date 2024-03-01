"use client"

import { useRouter } from "next/navigation"
import { DatasourceStatus } from "@/models/models"
import { zodResolver } from "@hookform/resolvers/zod"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast, useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  name: z.string().nonempty({
    message: "El nombre es obligatorio",
  }),
  description: z.string().nonempty({
    message: "La descripción es obligatoria",
  }),
})

export type DataType = {
  id: string
  name: string
  type: string
  description: string
  url: string
  status: string
}

export function DeleteButton({ id, profile }: { id: string; profile: Profile }) {
  const api = new Api(profile.api_key);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await api.deleteDatasource(id);
      toast({
        description: "Fuente de datos eliminada con éxito",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleDelete}
      className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
    >
      Borrar
    </Button>
  );
}


export function CopyButton({ id }: { id: string }) {
  const { toast } = useToast()
  return (
    <DropdownMenuItem
      onClick={() => {
        navigator.clipboard.writeText(id)
        toast({
          description: "ID de API copiado al portapapeles",
        })
      }}
    >
      Copy ID
    </DropdownMenuItem>
  )
}

export function EditTool({
  datasource,
  profile,
}: {
  datasource: DataType
  profile: Profile
}) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: datasource.name,
      description: datasource.description,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api.patchDatasource(datasource.id, {
        type: datasource.type,
        url: datasource.url,
        ...values,
      })
      toast({
        description: "Fuente de datos actualizada con éxito",
      })
      router.refresh()
    } catch (error: any) {
      toast({
        description: error?.message,
        variant: "destructive",
      })
    }
  }

  return (
    <DialogContent>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Actualizar fuente de datos</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Mi API" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Útil para hacer X..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="submit" size="sm" className="w-full">
              {form.control._formState.isSubmitting ? (
                <Spinner />
              ) : (
                "Actualizar fuente de datos"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}

export const columns = (profile: Profile): ColumnDef<DataType>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row, column }) => (
      <Badge variant="secondary">{row.getValue(column.id)}</Badge>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: getStatusBadge,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const datasource = row.original

      return (
        <div className="flex justify-end">
          <DeleteButton id={datasource.id} profile={profile} />
        </div>
      )
    },
  },
]

const getStatusBadge = ({ row, column }: any) => {
  const status = row.getValue(column.id)

  if (status === DatasourceStatus[DatasourceStatus.IN_PROGRESS])
    return <Badge variant="outline">En progreso</Badge>
  else if (status === DatasourceStatus[DatasourceStatus.DONE])
    return <Badge variant="secondary">Listo</Badge>
  else if (status === DatasourceStatus[DatasourceStatus.FAILED])
    return <Badge variant="destructive">Fallido</Badge>

  return <Badge variant="outline">Cargando...</Badge>
}
