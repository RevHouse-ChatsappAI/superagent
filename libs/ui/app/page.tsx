"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useForm } from "react-hook-form"
import { RxGithubLogo } from "react-icons/rx"
import * as z from "zod"

import { Api } from "@/lib/api"
import { analytics } from "@/lib/segment"
import { getSupabase } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import Logo from "@/components/logo"

const formSchema = z.object({
  email: z.string().email({
    message: "Dirección de correo electrónico no válida.",
  }),
})

const supabase = getSupabase()

export default function IndexPage() {
  const { toast } = useToast()
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email } = values
    const { error } = await supabase.auth.signInWithOtp({
      email,
    })

    if (error) {
      toast({
        description: `Ooops! ${error?.message}`,
      })

      return
    }

    toast({
      description:
        "🎉 ¡Hurra! Revisa tu correo para el enlace de inicio de sesión.",
    })
  }

  async function handleGithubLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    })

    if (error) {
      toast({
        description: `Ooops! ${error?.message}`,
      })

      return
    }
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, _session) => {
        if (event === "SIGNED_IN") {
          const fetchProfileAndIdentify = async () => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", _session?.user.id)
              .single()
            if (profile.api_key) {
              const api = new Api(profile.api_key)
              await api.indentifyUser({
                anonymousId: (await analytics.user()).anonymousId(),
                email: _session?.user.email,
                firstName: profile.first_name,
                lastName: profile.last_name,
                company: profile.company,
              })
            }
            window.location.href = "/home"
          }
          fetchProfileAndIdentify()
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth])

  return (
    <section className="container flex h-screen max-w-md flex-col justify-center space-y-8">
      <div className="flex justify-center rounded-full bg-black p-1 dark:bg-transparent">
        <Logo width={50} height={50} />
      </div>
      <Alert>
        <AlertTitle>¡Atención!</AlertTitle>
        <AlertDescription>
          Utiliza el método de autenticación que usaste la primera vez que te
          registraste, ya sea correo electrónico o Github. Usar ambos resultará
          en cuentas duplicadas.
        </AlertDescription>
      </Alert>
      <div className="flex flex-col space-y-0">
        <p className="text-lg font-bold">Iniciar sesión en ChatsAppAI Cloud</p>
        <p className="text-sm text-muted-foreground">
          Ingresa tu correo electrónico para recibir una contraseña de uso único
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Ingresa tu correo electrónico"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="sm" className="w-full">
            {form.control._formState.isSubmitting ? <Spinner /> : "Ingresar"}
          </Button>
        </form>
      </Form>
      <Separator />
      <Toaster />
    </section>
  )
}
