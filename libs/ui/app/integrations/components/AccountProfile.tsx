"use client"

import React from "react"

import { Profile } from "@/types/profile"
import { ProfileChatwoot } from "@/types/profileChatwoot"
import { Api } from "@/lib/api"
import { Spinner } from "@/components/ui/spinner"

interface Props {
  profile?: ProfileChatwoot
  profileSAgent: Profile
}

export const AccountProfile = ({ profile, profileSAgent }: Props) => {
  const [selectedAccount, setSelectedAccount] = React.useState<
    ProfileChatwoot[] | null
  >(null)

  React.useEffect(() => {
    const fetchTokenAndAccount = async () => {
      try {
        const api = new Api(profileSAgent.api_key)
        const tokenResponse = await api.getTokens()
        const token = tokenResponse?.data
        if (token && Array.isArray(token) && profile?.accounts) {
          const activeAccounts = profile.accounts.filter((account) =>
            token.some((tokenObj) => tokenObj.apiUserChatwoot == account.id)
          )
          setSelectedAccount(activeAccounts)
        }
      } catch (error) {
        console.error("Error fetching token or account", error)
      }
    }

    fetchTokenAndAccount()
  }, [profile, profileSAgent.api_key])

  return (
    <div className="w-full rounded p-2">
      <div className="mb-2 flex items-center gap-4 text-xs text-black dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-green-400"></div>
          <p>Cuentas con agentes.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {selectedAccount && selectedAccount.length > 0 ? (
          selectedAccount.map((account) => (
            <div
              key={account.id}
              className="flex h-[50px] items-center justify-center rounded-lg border-2 border-green-500 bg-green-400 p-1 text-black"
            >
              <span className="text-base md:text-lg">{account.name}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-black dark:text-gray-400">
          <div className="h-3 w-3 rounded bg-gray-400"></div>
          <p>Cuentas sin agentes.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {profile?.accounts ? (
            profile.accounts.filter(
              (account) =>
                !selectedAccount?.some((selected) => selected.id === account.id)
            ).length > 0 ? (
              profile.accounts
                .filter(
                  (account) =>
                    !selectedAccount?.some(
                      (selected) => selected.id === account.id
                    )
                )
                .map((account) => (
                  <div
                    key={account.id}
                    className="flex h-[50px] items-center justify-center rounded-sm bg-slate-200 p-1 text-black"
                  >
                    <span className="text-base md:text-lg">{account.name}</span>
                  </div>
                ))
            ) : (
              <div className="col-span-12 flex w-full items-center justify-start p-2 text-xs">
                <span>No hay agentes encontrados</span>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
