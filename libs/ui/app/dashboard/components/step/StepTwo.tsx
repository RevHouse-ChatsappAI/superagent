// Componente StepOne.jsx
import React, { useState } from "react"

import { ApiChatwootPlatform } from "@/lib/api_chatwoot"
import { useChatwoot } from "@/app/context/ChatwootContext"

import { ButtonPrev } from "../btn/ButtonPrev"

interface StepOneProps {
  nextStep: () => void
  prevStep: () => void
  btnPrevActive?: boolean
}

const StepTwo = ({
  nextStep,
  prevStep,
  btnPrevActive = true,
}: StepOneProps) => {
  //Context
  const { userProfileChatwoot, handleAccountId } = useChatwoot()

  //State
  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState("")
  const apiChatwoot = new ApiChatwootPlatform()

  //Function
  const handleAddUserChatwoot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const accountDetails = {
        name: account,
      }
      const accountResponse = await apiChatwoot.createAccount(accountDetails)

      if (accountResponse && accountResponse.id) {
        const adminUserDetails = {
          user_id: userProfileChatwoot?.id?.toString() || "",
          role: "administrator",
        }
        console.log(adminUserDetails)
        await apiChatwoot.createAccountUser(
          accountResponse.id,
          adminUserDetails
        )
        handleAccountId(accountResponse.id)
        nextStep()
        return
      } else {
        throw new Error("Fallo en la creación de la cuenta.")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <h2 className="mb-4 text-sm text-gray-400">
        Paso 2: Creación de Cuenta en Chatwoot
      </h2>
      <form
        onSubmit={handleAddUserChatwoot}
        className="flex flex-1 flex-col justify-between px-3"
      >
        <label className="flex w-full flex-col gap-1">
          <p className="text-sm">Account: </p>
          <input
            type="text"
            name="name"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="w-full rounded-lg p-2"
            placeholder="Eg: Account Company"
            required
          />
        </label>
        <div
          className={`mt-3 flex items-center ${
            btnPrevActive ? "justify-between" : "justify-end"
          }`}
        >
          {btnPrevActive && <ButtonPrev title="Previo" prevStep={prevStep} />}
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-sm text-white transition-all hover:bg-blue-400"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Crear Cuenta"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StepTwo
