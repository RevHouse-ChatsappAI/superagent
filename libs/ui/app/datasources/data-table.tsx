"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FilePicker } from "@apideck/file-picker-js"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import { v4 as uuidv4 } from "uuid"
import * as z from "zod"

import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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
import { UploadButton } from "@/components/upload-button"

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
    message: "Name is required",
  }),
  description: z.string().nonempty({
    message: "Description is required",
  }),
  type: z.string(),
  url: z.string(),
  metadata: z.any(),
})

export function DataTable<TData, TValue>({
  columns,
  data,
  profile,
  pagination: { currentPageNumber, take, totalPages },
}: DataTableProps<TData, TValue>) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()
  const api = new Api(profile.api_key)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [isLoadingFilePicker, setIsLoadingFilePicker] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [isDownloadingFile, setIsDownloadingFile] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<any | null>()
  const [selectedType, setSelectedType] = React.useState<string | null>()
  const [isOpeningVault, setIsOpeningVault] = React.useState<boolean>(false)
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
      type: "PDF",
      metadata: null,
    },
  })
  const supportedMimeTypes = [
    "application/pdf",
    "text/plain",
    "text/markdown",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data: vectorDbs } = await api.getVectorDbs()
      await api.createDatasource({
        ...values,
        vectorDbId: vectorDbs[0]?.id,
      })
      toast({
        description: "Fuente de datos creada con éxito",
      })
      router.refresh()
      setOpen(false)
      setIsLoadingFilePicker(false)
      setSelectedType(null)
      form.reset()
    } catch (error: any) {
      toast({
        description: error?.message,
      })
    }
  }

  function mapMimeTypeToFileType(mimeType: string): string {
    const typeMapping: { [key: string]: string } = {
      "text/plain": "TXT",
      "application/pdf": "PDF",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        "PPTX",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "DOCX",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "XLSX",
      "text/markdown": "MARKDOWN",
      "text/csv": "CSV",
    }

    return typeMapping[mimeType] || "UNKNOWN"
  }

  const openVault = async () => {
    // Open Vault with a valid session token
    const response = await fetch("/datasources/apideck/", {
      method: "POST",
      body: JSON.stringify({ userId: profile.user_id }),
    })
    const { data } = await response.json()
    FilePicker.open({
      token: data.session_token,
      title: "Superagent",
      subTitle: "Select a file",
      onReady: () => {
        setIsLoadingFilePicker(false)
      },
      onSelect: async (file: any) => {
        if (!supportedMimeTypes.includes(file.mime_type)) {
          toast({
            description: `File type ${file.mime_type} is not supported.`,
            variant: "destructive",
          })
          form.reset()
          return
        }

        setOpen(true)
        setIsOpeningVault(false)
        setSelectedFile(file)
        setIsDownloadingFile(true)
        const response = await fetch("/datasources/apideck/download", {
          method: "POST",
          body: JSON.stringify({
            fileId: file.id,
            userId: profile.user_id,
            mimeType: file.mime_type,
            fileName: file.name,
          }),
        })
        const { publicUrl } = await response.json()
        const fileType = mapMimeTypeToFileType(file.mime_type)

        form.setValue("url", publicUrl)
        form.setValue("type", fileType)

        setIsDownloadingFile(false)
      },
    })
  }

  const handleLocalFileUpload = async (file: File) => {
    setIsDownloadingFile(true)
    const storageName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_NAME
    if (!storageName) {
      throw new Error(
        "El nombre del almacenamiento no está definido en las variables de entorno."
      )
    }
    const { data, error } = await supabase.storage
      .from(storageName)
      .upload(uuidv4(), file, { contentType: file.type })

    if (data?.path) {
      const publicUrl = supabase.storage
        .from(storageName)
        .getPublicUrl(data?.path).data?.publicUrl
      form.setValue("url", publicUrl)
      form.setValue("type", mapMimeTypeToFileType(file.type))
    } else {
      throw error
    }

    setIsDownloadingFile(false)

    if (error) {
      toast({
        description: "Vaya, algo salió mal, ¡intenta de nuevo!",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex items-center space-x-4 py-4">
        <Button
          size="sm"
          className="mb-5 flex items-center justify-center gap-3 rounded-sm p-3"
          onClick={() => {
            setOpen(true)
          }}
        >
          {form.control._formState.isSubmitting || isDownloadingFile ? (
            <Spinner />
          ) : (
            <>
              <PlusIcon />
              <span>Crear nueva fuente de datos</span>
            </>
          )}
        </Button>
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value)
            setSelectedType(null)
            setIsOpeningVault(false)
            if (!value) {
              form.reset()
            }
          }}
        >
          <DialogContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <DialogHeader>
                  <DialogTitle>Crear nueva fuente de datos</DialogTitle>
                  <DialogDescription>
                    Conecta a tus fuentes de datos o archivos personalizados.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col space-y-2">
                  {!selectedType ? (
                    <div className="flex flex-col space-y-4">
                      {process.env.NEXT_PUBLIC_APIDECK_API_ID && (
                        <Alert className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <AlertTitle>
                              Servicios de Almacenamiento en la Nube
                            </AlertTitle>
                            <AlertDescription className="text-muted-foreground">
                              Importa desde Google Drive, Dropbox, Box, etc.
                            </AlertDescription>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={async () => {
                              setIsOpeningVault(true)
                              await openVault()
                              setSelectedType("files")
                              setOpen(false)
                            }}
                          >
                            {isOpeningVault ? <Spinner /> : "Add files"}
                          </Button>
                        </Alert>
                      )}
                      <Alert className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <AlertTitle>Archivos locales</AlertTitle>
                          <AlertDescription className="text-muted-foreground">
                            Importa archivos locales.
                          </AlertDescription>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedType("local")
                          }}
                        >
                          Upload files
                        </Button>
                      </Alert>
                      <Alert className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <AlertTitle>YouTube</AlertTitle>
                          <AlertDescription className="text-muted-foreground">
                            Importar desde YouTube
                          </AlertDescription>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedType("youtube")
                            form.setValue("type", "YOUTUBE")
                          }}
                        >
                          Importar
                        </Button>
                      </Alert>
                      <Alert className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <AlertTitle>Páginas web</AlertTitle>
                          <AlertDescription className="text-muted-foreground">
                            Importa desde cualquier página web o URL.
                          </AlertDescription>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedType("webpage")
                            form.setValue("type", "WEBPAGE")
                          }}
                        >
                          Añadir página web
                        </Button>
                      </Alert>
                      <Alert className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <AlertTitle>Github</AlertTitle>
                          <AlertDescription className="text-muted-foreground">
                            Importar un repositorio.
                          </AlertDescription>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedType("github")
                            form.setValue("type", "GITHUB_REPOSITORY")
                          }}
                        >
                          Añadir repositorio
                        </Button>
                      </Alert>
                      <Alert className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <AlertTitle>Apps</AlertTitle>
                          <AlertDescription className="text-muted-foreground">
                            Conectar aplicaciones de terceros.
                          </AlertDescription>
                        </div>
                        <Button variant="outline" size="sm">
                          Próximamente
                        </Button>
                      </Alert>
                    </div>
                  ) : (
                    <>
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
                              <Textarea
                                placeholder="Útil para hacer X..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  {selectedType === "youtube" && (
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL de YouTube</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej. https://www.youtube.com/watch?v=qhygOGPlC74"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {selectedType === "webpage" && (
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej. https://www.chatsappai.sh"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {selectedType === "github" && (
                    <>
                      <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URLs</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej. chatsappai" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="metadata.branch"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rama</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej. main" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  {selectedType === "local" && (
                    <div>
                      {!selectedFile ? (
                        <div className="relative flex flex-col items-center justify-between space-y-4 rounded-lg border border-dashed p-4">
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-sm">Seleccionar archivos</p>
                            <p className="text-sm text-muted-foreground">
                              Subir archivos locales desde tu dispositivo
                            </p>
                          </div>
                          <UploadButton
                            accept={supportedMimeTypes.join(",")}
                            label="Subir archivo"
                            onSelect={async (file) => {
                              handleLocalFileUpload(file)
                              setSelectedFile(file)
                            }}
                          />
                        </div>
                      ) : (
                        // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
                        <div className="flex items-center justify-between rounded-lg border border-green-900 bg-green-900 bg-opacity-20 py-1 pl-4 pr-2">
                          <p className="text-sm">{selectedFile.name}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedFile(null)}
                          >
                            <RxCross2 size="20px" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  {selectedType === "files" && (
                    <div>
                      {!selectedFile ? (
                        <div className="relative flex flex-col items-center justify-between space-y-4 rounded-lg border border-dashed p-4">
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-sm">Conectar a tus cuentas</p>
                            <p className="text-sm text-muted-foreground">
                              Google Drive, Dropbox, Box, etc.
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => openVault()}
                            variant="secondary"
                          >
                            Seleccionar archivo
                          </Button>
                        </div>
                      ) : (
                        // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
                        <div className="flex items-center justify-between rounded-lg border border-green-900 bg-green-900 bg-opacity-20 py-1 pl-4 pr-2">
                          <p className="text-sm">{selectedFile.name}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedFile(null)}
                          >
                            <RxCross2 size="20px" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {selectedType && (
                  <DialogFooter>
                    <Button type="submit" size="sm" className="w-full">
                      {form.control._formState.isSubmitting ||
                      isDownloadingFile ? (
                        <Spinner />
                      ) : (
                        "Crear fuente de datos"
                      )}
                    </Button>
                  </DialogFooter>
                )}
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
          <div className="mt-2 flex w-full flex-col items-center gap-2">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <div
                  className="grid flex-1 cursor-pointer grid-cols-12 gap-4 rounded-sm px-4 hover:bg-slate-200 hover:dark:bg-white-100"
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
                  No se encontraron fuentes de datos.
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
