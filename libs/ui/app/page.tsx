"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { ButtonAuth } from "@/components/ui/buttonAuth"
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
import { GoogleIcon } from "@/components/svg/GoogleIcon"
import { MicrosoftIcon } from "@/components/svg/MicrosoftIcon"

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
})

export default function IndexPage() {
  const supabase = createClientComponentClient()
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
      description: "🎉 ¡Hurra! Revisa tu correo electrónico para el enlace de inicio de sesión.",
    })
  }

  async function handleGithubLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
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
      async (event, _session) => {
        if (event === "SIGNED_IN") {
          window.location.href = "/home"
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth])

  return (
    <section className="container flex h-screen max-w-md flex-col justify-center space-y-8">
      <div className="flex flex-col space-y-4 text-center">
        <p className="text-3xl font-bold">Crea una cuenta</p>
        <p className="text-muted-foreground text-sm">
          Coloca tu email debajo para crear tu cuenta
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
            {form.control._formState.isSubmitting ? (
              <Spinner />
            ) : (
              "Ingresar"
            )}
          </Button>
        </form>
      </Form>
      <p className="my-6 text-center uppercase">O continuar con</p>
      <div className="flex flex-col items-center justify-center">
        <div className="mb-4 text-xl font-semibold">Próximamente</div>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={handleGithubLogin} className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
            <GoogleIcon />
          </button>
          <button className="flex h-24 w-24 cursor-not-allowed items-center justify-center rounded-lg border-2 border-dashed border-gray-300 opacity-50">
            <MicrosoftIcon />
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          Estamos trabajando para traerte nuevas formas de conectarte. ¡Mantente
          al tanto!
        </p>
      </div>
      <p className="mx-auto justify-center text-xs dark:text-gray-300">
        Al hacer click en continuar, aceptas nuestros Términos de Servicio y
        Política de Privacidad.
      </p>
      <Toaster />
    </section>
  )
}
