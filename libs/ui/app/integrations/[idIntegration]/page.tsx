import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"

import IntegrationsClientPage from "./client-page"

export default async function Integration() {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single()
  const api = new Api(profile.api_key)

  const [{ data: configuredDBs }, { data: configuredLLMs }] = await Promise.all(
    [await api.getVectorDbs(), await api.getLLMs()]
  )

  return (
    <div className="relative flex h-screen flex-col justify-between space-y-0 overflow-hidden">
      <div className="flex grow">
        <IntegrationsClientPage
          profile={profile}
          configuredDBs={configuredDBs}
          configuredLLMs={configuredLLMs}
        />
      </div>
    </div>
  )
}
