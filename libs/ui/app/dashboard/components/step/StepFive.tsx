// Componente StepOne.jsx
import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { ApiChatwootPlatform } from "@/lib/api_chatwoot"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/use-toast"
import { useChatwoot } from "@/app/context/ChatwootContext"

interface StepOneProps {
  nextStep: () => void
  profile: Profile
}

const StepFive = ({ nextStep, profile }: StepOneProps) => {
  //Context
  const { userProfileChatwoot, agentToken, apiAgent, handleChangeActiveToken, accountId } =
    useChatwoot()

  //State
  const [loading, setLoading] = useState(false)
  const api = useMemo(() => new Api(profile.api_key), [profile.api_key])
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleFinish = async () => {
    try {
      setLoading(true)
      const respToken = await api.createToken({
        apiUserChatwoot: accountId || "",
        userToken: userProfileChatwoot?.access_token || "",
        agentToken: agentToken?.toString() || "",
      })

      if (respToken) {
        setSuccess(true)
        toast({
          color: "green",
          description: respToken.message,
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const redirectAgent = () => {
    handleChangeActiveToken(true)
    router.refresh()
    router.push(`/agents/${apiAgent}`)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col items-center justify-center gap-3">
          {success && (
            <div className="flex flex-col gap-9">
              <div className="flex items-center justify-center space-x-2">
                <svg className="h-6 w-6 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                <h2 className="text-center text-lg text-green-500 dark:text-green-400">Creación Exitosa!</h2>
              </div>
              <button onClick={redirectAgent} className="rounded border bg-transparent px-4 py-2 font-semibold transition-all hover:bg-gray-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                Ir al agente
              </button>
            </div>
          )}
          {!success && (
            <button
              disabled={success}
              onClick={handleFinish}
              className="rounded border bg-transparent px-4 py-2 font-semibold text-white transition-all hover:border-transparent hover:bg-blue-500 hover:text-white dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-600"
            >
              {loading ? "Cargando..." : "Crear Cuenta en Chatwoot"}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default StepFive
