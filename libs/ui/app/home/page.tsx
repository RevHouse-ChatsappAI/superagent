import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { DataTable } from "./data-table"

export const dynamic = "force-dynamic"

export default async function Agents({
  searchParams,
}: {
  searchParams: {
    id: string
  }
}) {
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
    <div className="container text-black dark:text-white">
      <DataTable profile={profile} />
      <div>
        <h2 className="text-2xl font-semibold">Bienvenido a ChatsApp CLOUD</h2>
        <p className="mt-1 w-2/3 text-sm font-light">
          ChatsApp es una plataforma innovadora que ofrece agentes inteligentes
          desarrollados con IA, diseñados para transformar la manera en que
          interactúas y te comunicas.
        </p>
      </div>
      <div>
        <h2 className="text-md mb-5 font-semibold">
          ¡Inicia la aventura con nuestros tutoriales de IA para agentes!
        </h2>
        <div>
          <div className="flex max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="grow">
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Crear un Agente
              </h5>
              <p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">
                Aprende a crear tu propio agente inteligente en ChatsApp y
                mejora la interacción con tus usuarios.
              </p>
              <div className="mt-3 flex justify-end">
                <button
                  className="inline-flex cursor-not-allowed items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white opacity-50 dark:bg-blue-600"
                  disabled
                >
                  Próximamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
