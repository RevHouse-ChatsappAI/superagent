import type { Metadata } from "next"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { DataTable } from "./data-table"

export const metadata: Metadata = {
  title: "ChatsAppAI - Subscripciones",
}

export default async function Pricing() {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single()

  return (
    <div className="flex flex-col space-y-4 px-4 py-6">
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-10">
          <div className="mx-auto mb-8 max-w-screen-md text-center lg:mb-12">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Simple, transparente, rentable.
            </h2>
            <div className="flex flex-col gap-1">
              <p className="font-light text-gray-700 sm:text-xl dark:text-gray-400">
                Sin burocracia📄. Sin costos sorpresa💸. Cancela cuando quieras
                🏗️.
              </p>
              <span className="text-base font-bold text-gray-700 dark:text-gray-400">
                *Si en 30 días no estas satisfecho con el servicio te devolvemos
                tu dinero**Precios expresados en U$D*
              </span>
            </div>
          </div>
          <DataTable profile={profile} />
        </div>
      </section>
    </div>
  )
}
