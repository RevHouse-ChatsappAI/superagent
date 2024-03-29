import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Profile } from "@/types/profile"
import { ProfileChatwoot } from "@/types/profileChatwoot"
import { Api } from "@/lib/api"
import { ApiChatwoot } from "@/lib/api_chatwoot"

interface ChatwootProviderProps {
  children: ReactNode
}

interface PlatformKey {
  key: string;
  url: string;
}

export const ChatwootContext = createContext<{
  token: string
  tokenActive: boolean
  userProfileChatwoot: ProfileChatwoot | null
  agentToken: string,
  apiAgent: string,
  accountId: string,
  platformKey: PlatformKey | null,
  handleChangeToken: (value: string) => void
  handleChangeActiveToken: (value: boolean) => void
  handleProfileChatwoot: (profile: ProfileChatwoot) => void
  handleTokenChange: (value: string) => void
  handleAgentApi: (id: string) => void
  handleAccountId: (id: string) => void
}>({
  platformKey: null,
  token: "",
  agentToken: "",
  userProfileChatwoot: null,
  tokenActive: false,
  apiAgent: "",
  accountId: "",
  handleChangeToken: () => {},
  handleChangeActiveToken: () => {},
  handleProfileChatwoot: () => {},
  handleTokenChange: () => {},
  handleAgentApi: () => {},
  handleAccountId: () => {}
})

export const ChatwootProvider: React.FC<ChatwootProviderProps> = ({
  children,
}) => {
  const [token, setToken] = useState<string>("")
  const [platformKey, setPlatformKey] = useState<PlatformKey | null>(null);
  const [tokenActive, setTokenActive] = useState<boolean>(false)

  const [agentToken, setAgentToken] = useState("")
  const [apiAgent, setApiAgent] = useState("")
  const [accountId, setAccountId] = useState("")



  const [userProfileChatwoot, setUserProfileChatwoot] =
    useState<ProfileChatwoot | null>(null)

  useEffect(() => {
    const getDataProfile = async () => {
      try {
        const supabase = createClientComponentClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user?.id)
          .single()

        if (profile) {
          const api = new Api(profile.api_key)
          const response = await api.getToken()
          // CORREGIR ROMPE EL FLUJO CUANDO ESTAN CARGANDO
          const responsePlatformKey = await api.platformKey()

          if (response.success && response.data) {
            setTokenActive(true)
            setToken(response?.data?.userToken)
            setPlatformKey(responsePlatformKey?.data)
            // setAccountId(response.data.userProfileChatwoot)
            const apiChatwoot = new ApiChatwoot(response.data.userToken)

            const res = await apiChatwoot.getProfileChatwoot()
            setUserProfileChatwoot(res)
          } else {
            setTokenActive(false)
            throw new Error("Token not found")
          }
        } else {
          throw new Error("User not found")
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error)
        setTokenActive(false)
      }
    }

    getDataProfile()
  }, [])

  const handleChangeToken = (value: string) => {
    setToken(value)
  }

  const handleChangeActiveToken = (value: boolean) => {
    setTokenActive(value)
  }

  const handleProfileChatwoot = (profile: ProfileChatwoot) => {
    setUserProfileChatwoot({ ...profile })
  }

  const handleTokenChange = (token: string) => {
    setAgentToken(token)
  }

  const handleAgentApi = (id: string) => {
    setApiAgent(id)
  }

  const handleAccountId = (id: string) => {
    setAccountId(id)
  }
  return (
    <ChatwootContext.Provider
      value={{
        platformKey,
        userProfileChatwoot,
        token,
        handleChangeToken,
        tokenActive,
        handleChangeActiveToken,
        handleProfileChatwoot,
        agentToken,
        handleTokenChange,
        apiAgent,
        handleAgentApi,
        accountId,
        handleAccountId
      }}
    >
      {children}
    </ChatwootContext.Provider>
  )
}

export const useChatwoot = () => {
  return useContext(ChatwootContext)
}
