"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { TbPlus } from "react-icons/tb"
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  task: z.string().nonempty({
    message: "Se requiere una tarea",
  }),
  result: z.string().nonempty({
    message: "Se requiere un resultado esperado",
  }),
  description: z.string().nonempty({
    message: "Se requiere una descripción",
  }),
})

interface AddAutoPrompterProps {
  profile: any
  handleAutoPromptChange: (newPrompt: string) => void
}

function AddAutoPrompter({
  profile,
  handleAutoPromptChange,
}: AddAutoPrompterProps) {
  const { toast } = useToast()
  const api = new Api(profile.api_key)

  const [open, setOpen] = React.useState(false)

  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
      result: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const resp = await api.generateTemplatePrompt({
        task: values.task,
        result: values.result,
        description: values.description,
      })
      console.log(resp.output)
      const startIndex = resp?.output.indexOf("```")
      const endIndex = resp?.output.lastIndexOf("```")
      const output = resp?.output.slice(startIndex + 9, endIndex)
      handleAutoPromptChange(output)

      toast({
        description: "Prompt creado correctamente",
      })
      setOpen(false)
      form.reset()
    } catch (error: any) {
      toast({
        description: error?.message,
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (!value) {
          form.reset()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          aria-label="Autocomplete"
          className="animate-gradient-x absolute bottom-2 right-2 flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#6469ff] to-[#8d68fd] px-4 py-2 font-medium text-white transition-colors duration-1000 ease-in-out hover:from-[#5c5dff] hover:to-[#7e5cff] dark:from-[#8d68fd] dark:to-[#6469ff] dark:hover:from-[#7e5cff] dark:hover:to-[#5c5dff]"
        >
          {form.control._formState.isSubmitting ? (
            <Spinner />
          ) : (
            <div className="flex items-center space-x-1">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="m14 7 3 3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M5 6v4" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M19 14v4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 2v2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M7 8H3" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M21 16h-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 3H9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mr-2 text-xs font-medium">Auto completar</span>
            </div>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <Form {...form}>
          <div
            onSubmit={(event) => {
              event.stopPropagation()
            }}
          >
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <DialogHeader>
                <DialogTitle>Crear nuevo template</DialogTitle>
                <DialogDescription>
                  Crear un nuevo template con opciones personalizadas.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col space-y-2">
                <FormField
                  control={form.control}
                  name="task"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tarea a resolver</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ejemplo: crear un agente para cocina"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="result"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resultado esperado</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ejemplo: crear un agente para cocina"
                          {...field}
                        />
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
                      <FormLabel>Descripción del trabajo con detalle</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ejemplo: crear un agente para cocina"
                          {...field}
                        />
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
                    "Agregar instrucción"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddAutoPrompter
