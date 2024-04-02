import React, { useState } from "react"

import { Profile } from "@/types/profile"
import { ProfileChatwoot } from "@/types/profileChatwoot"
import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/use-toast"

interface PlatformKey {
  key: string
  url: string
}

interface Props {
  profile?: ProfileChatwoot
  profileSAgent: Profile
  platformKey: PlatformKey
}

export const SettingCRM = ({ profile, profileSAgent, platformKey }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [key, setKey] = useState(platformKey.key ?? "")
  const [url, setUrl] = useState(platformKey.url ?? "")

  const { toast } = useToast()

  const handleUpdateKeyPlatform = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    try {
      const api = new Api(profileSAgent?.api_key)

      const platformKeyData = await api.putPlatformKey({ key: key, url: url })
      if (platformKeyData.success) {
        toast({
          description: platformKeyData.message,
        })
      } else {
        toast({
          description: platformKeyData.message,
        })
      }
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleUpdateKeyPlatform}
      className="flex flex-1 flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <Label>
          <div className="flex flex-col gap-2">
            <h2>API URL del CRM Chatwoot</h2>
          </div>
        </Label>
        <Input
          onChange={(e) => setUrl(e.target.value)}
          type="text"
          value={url ?? ""}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>
          <div className="flex flex-col gap-2">
            <h2>Clave de la plataforma (CRM Chatwoot)</h2>
            <p className="text-xs text-gray-400">
              Introduce la clave de tu plataforma CRM Chatwoot para establecer
              la conexión y habilitar la integración con nuestro Super Agente.
            </p>
          </div>
        </Label>
        <Input
          onChange={(e) => setKey(e.target.value)}
          type="password"
          value={key ?? ""}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Nombre</Label>
        <Input type="text" value={profile?.available_name ?? ""} disabled />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Rol</Label>
        <Input type="text" value={profile?.role ?? ""} disabled />
      </div>
      <div className="flex justify-end">
        <Button type="submit">
          {loading ? <Spinner /> : "Guardar cambios"}
        </Button>
      </div>
    </form>
  )
}
