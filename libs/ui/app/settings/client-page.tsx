"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Profile } from "@/types/profile"
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
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/use-toast"

interface SettingsClientPageProps {
  profile: Profile
  user: any
}

const formSchema = z.object({
  first_name: z.string().nonempty("Invalid first name."),
  last_name: z.string().nonempty("Invalid last name."),
  company: z.string(),
})

const SettingsClientPage: React.FC<SettingsClientPageProps> = ({
  profile,
  user,
}) => {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: profile.first_name,
      last_name: profile.last_name,
      company: profile.company,
    },
  })

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }, [supabase])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { first_name, last_name, company } = values
    const { error } = await supabase
      .from("profiles")
      .update({ first_name, last_name, company })
      .eq("id", profile.id)

    if (error) {
      toast({
        description: `Ooops! ${error?.message}`,
      })

      return
    }
    toast({
      description: `¡Los ajustes han sido guardados!`,
    })
  }

  return (
    <div className="flex max-w-xl flex-col items-start justify-start space-y-8">
      <div className="flex flex-col space-y-2">
        <p className="text-sm font-bold">Personal</p>
        <p className="text-muted-foreground text-sm">
          Actualiza tus configuraciones personales
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="flex flex-col space-y-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa tu nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Apellidos</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa tus apellidos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa el nombre de tu empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input disabled value={user.email} />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
          <Button type="submit" size="sm">
            {form.control._formState.isSubmitting ? (
              <Spinner />
            ) : (
              "Guardar configuraciones"
            )}
          </Button>
        </form>
      </Form>
      <Separator />
      <Button onClick={handleSignOut} size="sm" variant="secondary">
        Cerrar sesión de tu cuenta
      </Button>
    </div>
  )
}

export default SettingsClientPage
