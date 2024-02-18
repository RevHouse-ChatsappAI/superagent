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
              <h2 className="text-center text-lg text-green-500">Creación Exitosa!</h2>
              <button onClick={redirectAgent} className="hover:bg-white-100 rounded border border-gray-300 bg-transparent px-4 py-2 font-semibold transition-all hover:border-transparent">
                Ir al Agent
              </button>
            </div>
          )}
          {!success && (
            <button
              disabled={success}
              onClick={handleFinish}
              className="border-white-500 rounded border bg-transparent px-4 py-2 font-semibold text-white transition-all hover:border-transparent hover:bg-blue-500 hover:text-white"
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
