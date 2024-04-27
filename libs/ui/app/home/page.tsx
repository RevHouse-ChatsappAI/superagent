import { cookies } from "next/headers"
import Script from "next/script"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

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
      <Script
        id="show-banner"
        dangerouslySetInnerHTML={{
          __html: `
              (function(d, t) {
                var BASE_URL = "https://app.chatsappai.com";
                var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
                g.src = BASE_URL + "/packs/js/sdk.js";
                g.defer = true;
                g.async = true;
                s.parentNode.insertBefore(g, s);
                g.onload = function() {
                  window.chatwootSDK.run({
                    websiteToken: 'sERCPLnqogA9awfsN7Qx3RXf',
                    baseUrl: BASE_URL
                  });
                }
              })(document, "script");
            `,
        }}
      />
      <div className="flex flex-col gap-2 py-4">
        <h2 className="text-2xl font-medium">Bienvenido a ChatsApp CLOUD</h2>
        <p className="text-md mt-1 w-2/3 font-light">
          ChatsApp es una plataforma innovadora que ofrece agentes inteligentes
          desarrollados con IA, diseñados para transformar la manera en que
          interactúas y te comunicas.
        </p>
      </div>
      <div className="border-t-2 pt-6">
        <h2 className="mb-5 text-xl font-semibold">
          ¡Inicia la aventura con nuestros tutoriales de IA para agentes!
        </h2>
        <div className="flex gap-2">
          <div className="relative flex max-w-sm rounded-lg border border-gray-200 bg-white p-5 shadow-md transition-colors hover:border-black dark:border-gray-700 dark:bg-gray-800 dark:hover:border-white">
            <div className="grow">
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Creación de un Agente
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
