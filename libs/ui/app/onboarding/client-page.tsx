"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { initialSamlValue } from "@/config/saml"
import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

import { onboardFormSchema } from "../api/onboard/form-schema"

export default function OnboardingClientPage() {
  const { toast } = useToast()
  const { ...form } = useForm<z.infer<typeof onboardFormSchema>>({
    resolver: zodResolver(onboardFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      company: "",
    },
  })

  async function onSubmit(values: z.infer<typeof onboardFormSchema>) {
    const res = await fetch("/api/onboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    const profile = await res.json()

    if (!res.ok || !profile) {
      return toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    }

    window.location.href = `/pricing`
  }

  return (
    <div className="flex min-h-screen flex-col justify-center">
      <div className="container max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¡Bienvenido!</CardTitle>
                <CardDescription>
                  Cuéntanos un poco más sobre ti.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between space-x-2">
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
                          <FormLabel>Apellido</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ingresa tu apellido"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la empresa</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa el nombre de tu empresa"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" size="sm" className="w-full">
                  {form.control._formState.isSubmitting ? (
                    <Spinner />
                  ) : (
                    "Guardar"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
      <Toaster />
    </div>
  )
}
