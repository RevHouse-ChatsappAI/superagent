"use client"

import { RxCopy } from "react-icons/rx"

import { Profile } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface ApiKeysPageProps {
  profile: Profile
}

const ApiKeysClientPage: React.FC<ApiKeysPageProps> = ({ profile }) => {
  const { toast } = useToast()
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profile.api_key)
    toast({ description: "Clave API copiada al portapapeles" })
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <p className="text-sm font-bold">API keys</p>
        <p className="text-sm text-muted-foreground">
          Utilice la siguiente clave API para conectarse a Superagent a través
          de la API REST o el SDK
        </p>
      </div>
      <div className="flex w-full max-w-sm justify-between space-x-2">
        <Input type="password" value={profile.api_key} />
        <Button
          onClick={() => copyToClipboard()}
          variant="secondary"
          className="flex flex-row space-x-2"
        >
          <RxCopy />
          <p>Copy</p>
        </Button>
      </div>
    </div>
  )
}

export default ApiKeysClientPage
