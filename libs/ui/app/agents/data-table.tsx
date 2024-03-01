"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useForm } from "react-hook-form"
import { useAsync } from "react-use"
import * as z from "zod"

import { Profile } from "@/types/profile"
import { siteConfig } from "@/config/site"
import { Api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
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
import { PlusIcon } from "@/components/svg/PlusIcon"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  profile: Profile
  pagination: {
    take: number
    currentPageNumber: number
    totalPages: number
  }
}

interface Datasource {
  id: string
  name: string
}

interface Tool {
  id: string
  name: string
}

const formSchema = z.object({
  name: z.string().nonempty({
    message: "El nombre es requerido",
  }),
  description: z.string().nonempty({
    message: "La descripción es requerida",
  }),
  isActive: z.boolean().default(true),
  llmModel: z.string().nonempty({
    message: "El modelo es requerido",
  }),
  tools: z.array(z.string()),
  datasources: z.array(z.string()),
  prompt: z.string(),
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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    pageCount: totalPages,
    state: {
      columnFilters,
      pagination: {
        pageIndex: 0, // we are setting pageIndex to 0 because we have only the current page's data
        pageSize: take,
      },
    },
  })
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      llmModel: "GPT_3_5_TURBO_16K_0613",
      isActive: true,
      tools: [],
      datasources: [],
      prompt: "Eres un asistente de IA útil",
    },
  })
  const { value: llms = [] } = useAsync(async () => {
    const { data } = await api.getLLMs()
    return data
  }, [])

  const { value: tools = [] } = useAsync(async () => {
    const { data } = await api.getTools()
    return data
  }, [])
  const { value: datasources = [] } = useAsync(async () => {
    const { data } = await api.getDatasources()
    return data
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { tools, datasources } = values

      const { data: agent } = await api.createAgent({
        ...values,
        llmModel: siteConfig.defaultLLM,
      })

      for (const toolId of tools) {
        await api.createAgentTool(agent.id, toolId)
      }

      for (const datasourceId of datasources) {
        await api.createAgentDatasource(agent.id, datasourceId)
      }

      toast({
        description: "¡Nuevo agente creado!",
      })
      router.refresh()
      router.push(`/agents/${agent.id}`)
    } catch (error: any) {
      toast({
        description: error?.message,
        variant: "destructive",
      })
    }
  }
  const searchParams = useSearchParams()

  const isAddNewAgentModalOpen = Boolean(searchParams.get("addNewAgentModal"))

  return (
    <div className="p-5">
      <div className="flex items-center space-x-4 py-4">
        <Dialog defaultOpen={isAddNewAgentModalOpen}>
          <DialogTrigger
            className={cn(buttonVariants({ variant: "default", size: "sm" })) + "flex gap-3 p-3 rounded-sm items-center mb-5"}
          >
            <PlusIcon/>
            <p>Crear un nuevo agente</p>
          </DialogTrigger>
          <DialogContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>Crear nuevo agente</DialogTitle>
                  <DialogDescription>
                    Adjunta fuentes de datos y APIs a tu agente para hacerlo más
                    poderoso.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-2">
                  {llms.length === 0 && (
                    <Alert className="flex justify-between">
                      <div className="flex flex-col">
                        <AlertTitle>¡Atención!</AlertTitle>
                        <AlertDescription className="text-gray-500">
                          No has configurado un LLM.
                        </AlertDescription>
                      </div>
                      <Link passHref href="/llms">
                        <Button size="sm">Configurar</Button>
                      </Link>
                    </Alert>
                  )}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Por ejemplo, Mi agente" {...field} />
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
                            placeholder="Por ejemplo, este agente es experto en..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {tools.length > 0 && (
                    <FormField
                      control={form.control}
                      name="tools"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>APIs</FormLabel>
                          <FormControl>
                            <MultiSelect
                              placeholder="Selecciona una API..."
                              data={tools.map((tool: Tool) => ({
                                value: tool.id,
                                label: tool.name,
                              }))}
                              onChange={(values: { value: string }[]) => {
                                field.onChange(values.map(({ value }) => value))
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {datasources.length > 0 && (
                    <FormField
                      control={form.control}
                      name="datasources"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuentes de datos</FormLabel>
                          <FormControl>
                            <MultiSelect
                              placeholder="Selecciona una fuente de datos..."
                              data={datasources.map(
                                (datasource: Datasource) => ({
                                  value: datasource.id,
                                  label: datasource.name,
                                })
                              )}
                              onChange={(values: { value: string }[]) => {
                                field.onChange(values.map(({ value }) => value))
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <DialogFooter>
                  <Button
                    disabled={llms.length === 0}
                    type="submit"
                    size="sm"
                    className="w-full"
                  >
                    {form.control._formState.isSubmitting ? (
                      <Spinner />
                    ) : (
                      "Crear agente"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <div className="flex w-full">
          {table.getHeaderGroups().map((headerGroup) => (
            <div className="grid flex-1 grid-cols-12 gap-4" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <div className="col-span-3 text-xs text-gray-400" key={header.id}>
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
        <div className="mt-2 flex w-full flex-col items-center gap-2">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div
                className="dark:hover:bg-white-100 grid w-full cursor-pointer grid-cols-12 gap-4 rounded-sm px-4 transition-all hover:bg-slate-300"
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                onClick={() =>
                  router.push(`/agents/${(row.original as any).id}`)
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="col-span-3 py-3 text-start">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="flex w-full justify-center">
              <div className="h-24 w-full text-center">
                Sin resultados.
              </div>
            </div>
          )}
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
