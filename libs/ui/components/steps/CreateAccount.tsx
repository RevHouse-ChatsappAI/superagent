import React, { useState } from "react"

import { ApiChatwootPlatform } from "@/lib/api_chatwoot"
import { useChatwoot } from "@/app/context/ChatwootContext"

import { Spinner } from "@/components/ui/spinner"

import { MdNavigateNext } from "react-icons/md";
import { ButtonPrev } from "@/app/dashboard/components/btn/ButtonPrev";
import { Profile } from "@/types/profile";
import { Api } from "@/lib/api";

interface StepOneProps {
  nextStep: () => void
  prevStep: () => void
  btnPrevActive?: boolean
  profile: Profile
}

const CreateAccount = ({
  nextStep,
  prevStep,
  btnPrevActive = true,
  profile
}: StepOneProps) => {
  //Context
  const { userProfileChatwoot, handleAccountId } = useChatwoot()

  //State
  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState(() => {
    return localStorage.getItem('account') || "";
  });
  const apiChatwoot = new Api(profile.api_key)

  //Function
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAccount = e.target.value;
    setAccount(newAccount);
    localStorage.setItem('account', newAccount);
  };

  const handleAddUserChatwoot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const accountDetails = {
        name: account,
      }
      const accountResponse = await apiChatwoot.postCreateAccount(accountDetails)

      if (accountResponse && accountResponse.id) {
        const adminUserDetails = {
          user_id: userProfileChatwoot?.id?.toString() || "",
          role: "administrator",
        }

        await apiChatwoot.postCreateAccountUser(
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
      <h2 className="mb-4 text-sm text-gray-700 dark:text-gray-500">
        Creación de Cuenta en Chatwoot
      </h2>
      <form
        onSubmit={handleAddUserChatwoot}
        className="flex flex-1 flex-col justify-between"
      >
        <label className="flex w-full flex-col gap-1">
          <p className="text-sm">Cuenta: </p>
          <input
            type="text"
            name="name"
            value={account}
            onChange={handleAccountChange}
            className="w-full rounded-lg border border-gray-300 bg-transparent p-2 text-sm text-gray-900 placeholder:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
            placeholder="Ej: Empresa Cuenta"
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
            {loading ? <Spinner/> : <MdNavigateNext/>}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateAccount
