"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { json } from "@codemirror/lang-json"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import CodeMirror from "@uiw/react-codemirror"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Profile } from "@/types/profile"
import { siteConfig } from "@/config/site"
import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { DataTablePagination } from "@/components/data-table-pagination"

interface DataTableProps<TData, TValue> {
  columns: (profile: Profile) => ColumnDef<TData, TValue>[]
  data: TData[]
  profile: Profile
  pagination: {
    take: number
    currentPageNumber: number
    totalPages: number
  }
}

const formSchema = z.object({
  name: z.string().nonempty({
    message: "El nombre es requerido",
  }),
  description: z.string().nonempty({
    message: "La descripción es requerida",
  }),
  type: z.string().nonempty({
    message: "El tipo de herramienta es requerida",
  }),
  metadata: z.any(),
  returnDirect: z.boolean(),
})

export function DataTable<TData, TValue>({
  columns,
  data,
  profile,
  pagination: { currentPageNumber, take, totalPages },
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const { toast } = useToast()
  const api = new Api(profile.api_key)
  const [open, setOpen] = React.useState(false)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const table = useReactTable({
    data,
    columns: columns(profile),
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    pageCount: totalPages,
    state: {
      columnFilters,
      pagination: {
        pageIndex: 0,
        pageSize: take,
      },
    },
  })
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "BING_SEARCH",
      metadata: null,
      returnDirect: false,
    },
  })
  const type = form.watch("type")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api.createTool({
        ...values,
      })
      toast({
        description: "Herramienta creada correctamente",
      })
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      toast({
        description: error?.message,
      })
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center space-x-4 py-4">
        <Button
          size="sm"
          onClick={() => {
            setOpen(true)
          }}
        >
          {form.control._formState.isSubmitting ? <Spinner /> : "Nueva API"}
        </Button>
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value)
            if (!value) {
              form.reset()
            }
          }}
        >
          <DialogContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>Crear nueva conexión API</DialogTitle>
                  <DialogDescription>
                    Conecte sus agentes a miles de API de terceros y
                    herramientas.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Ejemplo: mi API" {...field} />
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
                          <Textarea
                            placeholder="Útil para hacer X..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo de herramienta" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {siteConfig.toolTypes.map((toolType) => (
                              <SelectItem
                                key={toolType.value}
                                value={toolType.value}
                              >
                                {toolType.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {siteConfig.toolTypes
                    .find((toolType) => toolType.value === type)
                    ?.metadata.map((metadataField) => (
                      <FormField
                        key={metadataField.key}
                        control={form.control}
                        name={`metadata.${metadataField.key}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{metadataField.label}</FormLabel>
                            {metadataField.type === "input" && (
                              <FormControl>
                                <Input {...field} type="text" />
                              </FormControl>
                            )}
                            {metadataField.type === "password" && (
                              <FormControl>
                                <Input {...field} type="password" />
                              </FormControl>
                            )}
                            {metadataField.type === "json" && (
                              <div className="overflow-hidden rounded-lg">
                                <CodeMirror
                                  className="rounded-lg text-xs"
                                  extensions={[json()]}
                                  theme={vscodeDark}
                                  onChange={field.onChange}
                                  value={
                                    "json" in metadataField
                                      ? JSON.stringify(
                                          metadataField.json,
                                          null,
                                          2
                                        )
                                      : undefined
                                  }
                                />
                              </div>
                            )}
                            {"helpText" in metadataField && (
                              <FormDescription>
                                {metadataField.helpText}
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                </div>
                <DialogFooter>
                  <Button type="submit" size="sm" className="w-full">
                    {form.control._formState.isSubmitting ? (
                      <Spinner />
                    ) : (
                      "Crear API"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <div>
          <div className="flex w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <div
                className="grid flex-1 grid-cols-12 gap-4"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <div
                      className="col-span-2 text-xs text-gray-400"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          <div className="mt-2">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <div
                  className="hover:bg-white-100 grid flex-1 cursor-pointer grid-cols-12 gap-4 rounded-sm px-4"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <div key={cell.id} className="col-span-2 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No se han encontrado herramientas.
                </TableCell>
              </TableRow>
            )}
          </div>
        </div>
      </div>
      <DataTablePagination
        className="py-4"
        table={table}
        currentPageNumber={currentPageNumber}
      />
      <Toaster />
    </div>
  )
}
