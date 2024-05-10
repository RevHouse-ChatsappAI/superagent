"use client"

import React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Form, FormProvider, useForm } from "react-hook-form"
import { IoChevronBack } from "react-icons/io5"
import { string } from "zod"

import { integrationsConfig } from "@/config/integration"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

export default function IntegrationsClientPage({
  profile,
  configuredDBs,
  configuredLLMs,
}: {
  profile: any
  configuredDBs: any
  configuredLLMs: any
}) {
  const params = useParams()

  const { idIntegration } = useParams()
  const selectedProvider = integrationsConfig.find(
    (integration) => integration.id === idIntegration
  )

  const formMethods = useForm()

  async function onSubmit(values: any) {
    console.log(values)
  }

  return (
    <div className="container mx-auto w-[500px] border-x bg-slate-200 py-4 dark:bg-transparent">
      <div>
        <Link
          href="/integrations"
          className="flex items-center gap-2 rounded-lg"
        >
          <IoChevronBack />
          <span className="text-xs font-medium">Volver a integraciones</span>
        </Link>
      </div>
      <h2 className="mb-5 pt-3 text-2xl font-medium">
        {selectedProvider?.name}
      </h2>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          {selectedProvider?.metadata.map((metadataField: any) => (
            <FormField
              key={metadataField.key}
              control={formMethods.control}
              name={metadataField.key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{metadataField.label}</FormLabel>
                  {metadataField.type === "input" && (
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={
                          "placeholder" in metadataField
                            ? metadataField.placeholder
                            : ""
                        }
                        className="text-black dark:text-white"
                        type="text"
                      />
                    </FormControl>
                  )}
                  {"helpText" in metadataField && (
                    <FormDescription className="pb-2">
                      {metadataField.helpText as string}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <div className="flex justify-end">
            <Button type="submit" size="sm">
              {formMethods.formState.isSubmitting ? <Spinner /> : "Guardar"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
