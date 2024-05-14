import React from "react"
import { FormProvider, useForm } from "react-hook-form"

import { ApiChatwootPlatformExtend } from "@/lib/api_chatwoot"
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
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

interface Props {
  subscriptionId: string
  access_token: string
  url: string
  components: Array<object>
}

export const Chatwoot = ({
  subscriptionId,
  access_token,
  url,
  components,
}: Props) => {
  const formMethods = useForm()
  async function onSubmit(values: any) {
    console.log(values)
    return
    const api = new ApiChatwootPlatformExtend(url, subscriptionId, access_token)

    const mock = {
      name: values?.name,
      email: values?.email,
      password: values?.password,
      custom_attributes: {},
    }
    const response = await api.createUser(mock)

    if (response.confirmed) {
      console.log(response)
    }
  }

  return (
    <div>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="w-full space-y-4 pb-10"
        >
          {components.map((metadataField: any, index: number) => (
            <FormField
              key={index} // Usar index como key si el campo es un separador y podría no tener una key única
              control={formMethods.control}
              name={metadataField.key || `separator-${index}`} // Proporcionar un nombre fallback para separadores
              render={({ field }) => (
                <FormItem>
                  {metadataField.type === "separator" ? (
                    <Separator className="my-4" />
                  ) : (
                    <>
                      {"helpText" in metadataField && (
                        <FormDescription className="pb-2">
                          {metadataField.helpText as string}
                        </FormDescription>
                      )}
                      <FormLabel>
                        {metadataField.label}{" "}
                        <span className="text-xs text-red-600">
                          {metadataField.required && "(*)"}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={
                            "placeholder" in metadataField
                              ? metadataField.placeholder
                              : ""
                          }
                          className="text-black dark:text-white"
                          type={
                            metadataField.type === "password"
                              ? "password"
                              : "text"
                          }
                        />
                      </FormControl>

                      <FormMessage />
                    </>
                  )}
                </FormItem>
              )}
            />
          ))}
          <div className="flex items-center justify-end gap-2">
            <Button type="submit" size="sm">
              {formMethods.formState.isSubmitting ? <Spinner /> : "Guardar"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
