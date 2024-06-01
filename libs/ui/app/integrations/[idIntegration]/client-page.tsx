"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { FormProvider, useForm } from "react-hook-form"
import { AiOutlineConsoleSql } from "react-icons/ai"
import { IoChevronBack } from "react-icons/io5"

import { integrationsConfig } from "@/config/integration"
import { Api } from "@/lib/api"
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
import { BadgeStatus } from "@/components/BadgeStatus"

import { Chatwoot } from "./components/Chatwoot"

type Actions = {
  [key: string]: (values: any) => Promise<{ success: boolean }>
}
type GetResources = {
  [key: string]: () => Promise<any>
}

export default function IntegrationsClientPage({
  profile,
  configuredDBs,
  configuredLLMs,
}: {
  profile: any
  configuredDBs: any
  configuredLLMs: any
}) {
  const { idIntegration } = useParams()
  const selectedProvider = integrationsConfig.find(
    (integration) => integration.id === idIntegration
  )

  const formMethods = useForm()
  const api = useMemo(() => new Api(profile.api_key), [profile.api_key])
  const [isActive, setIsActive] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [data, setData] = useState<any>(null)

  const getResources: GetResources = useMemo(
    () => ({
      chatwoot: async () => {
        return api.platformKey()
      },
    }),
    [api]
  )

  const actions: Actions = {
    chatwoot: async (values: any) => {
      return api.postPlatformKey({
        key: values.key,
        url: values.url,
        subscriptionId: values.subscriptionId,
      })
    },
  }

  useEffect(() => {
    const fetchData = async () => {
      const getResource = getResources[idIntegration as string]
      if (getResource) {
        try {
          const resp = await getResource()
          if (resp.success) {
            setData(resp.data)
            setIsActive(resp.success)
            setIsEdit(true)
          }
        } catch (error) {
          console.error("Error al obtener datos de la plataforma:", error)
        }
      } else {
        console.log(
          "No hay función definida para obtener recursos de esta integración:",
          idIntegration
        )
      }
    }

    fetchData()
  }, [idIntegration, getResources])

  async function onSubmit(values: any) {
    const action = actions[idIntegration as string]

    if (action) {
      try {
        const resp = await action(values)
        if (resp.success) {
          setIsActive(resp.success)
          setIsEdit(false)
        }
      } catch (error) {
        console.error("Error al ejecutar la acción:", error)
      }
    } else {
      console.log(
        "No hay acción definida para este ID de integración:",
        idIntegration
      )
    }
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
      <div className="mb-5 flex items-center gap-2 pt-3">
        <h2 className="text-2xl font-medium">{selectedProvider?.name}</h2>
        {isActive && (
          <div className="flex items-center gap-2">
            <BadgeStatus name="Conectado" style="bg-green-600" />
            <Button
              onClick={() => setIsEdit(!isEdit)}
              type="button"
              size="xs"
              className="bg-transparent text-xs dark:text-white dark:hover:text-black"
            >
              {formMethods.formState.isSubmitting ? <Spinner /> : "Editar"}
            </Button>
          </div>
        )}
      </div>

      {(!isActive || !isEdit) && (
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
                    <FormLabel>
                      {metadataField.label}{" "}
                      <span className="text-xs text-red-600">
                        {metadataField.required && "(*)"}
                      </span>
                    </FormLabel>
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
            <div className="flex items-center justify-end gap-2">
              {isEdit && (
                <Button
                  disabled={formMethods.formState.isSubmitting}
                  type="button"
                  onClick={() => setIsEdit(false)}
                  size="sm"
                >
                  Cancelar edición
                </Button>
              )}

              <Button type="submit" size="sm">
                {formMethods.formState.isSubmitting ? <Spinner /> : "Guardar"}
              </Button>
            </div>
          </form>
        </FormProvider>
      )}
      {idIntegration == "chatwoot" && (
        <Chatwoot
          subscriptionId={data?.subscriptionId}
          access_token={data?.key}
          url={data?.url}
          components={selectedProvider?.subMetaData || []}
        />
      )}
    </div>
  )
}
