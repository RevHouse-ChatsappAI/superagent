import { cookies } from "next/headers"
import Image from "next/image"
import Script from "next/script"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { PlayIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

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
                    baseUrl: BASE_URL,
                    position: 'right',
                    type: 'expanded_bubble',
                    launcherTitle: 'Chatea con ChatsappAI'
                  });
                }
              })(document, "script");
            `,
        }}
      />
      <div className="flex flex-col gap-2 py-4">
        <h2 className="text-3xl font-medium">Bienvenido a ChatsApp CLOUD</h2>
        <p className="text-md mt-1 w-2/3 font-light">
          ChatsApp es una plataforma innovadora que ofrece agentes inteligentes
          desarrollados con IA, diseñados para transformar la manera en que
          interactúas y te comunicas.
        </p>
      </div>
      <div className="py-6">
        <h2 className="mb-5 text-xl font-semibold">
          ¡Inicia la aventura con nuestros tutoriales de IA para agentes!
        </h2>
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-lg border px-6 pb-5 pt-3 shadow-sm dark:bg-[#1F1F1F] dark:text-white">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="rounded-full bg-gray-600 px-2 py-1 text-xs font-medium uppercase tracking-wider text-white">
                  Original
                </span>
              </div>
              <div>
                <Button
                  className="flex w-full items-center gap-1 p-2 hover:bg-slate-200 dark:hover:bg-black/50"
                  size="icon"
                  variant="ghost"
                >
                  <PlayIcon className="h-3 w-3 fill-white text-xs" />
                  <span className="text-xs">Ver video</span>
                </Button>
              </div>
            </div>
            <div>
              <div className="mb-6 h-[150px] w-full">
                <Image
                  src={"/agenttuto.webp"}
                  alt="Agent Tutorials"
                  width={0}
                  height={0}
                  sizes="20vw"
                  className="rounded-md"
                  objectFit="cover"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <h3 className="text-xl font-bold">Creación de multiagentes</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aprende a crear y gestionar múltiples agentes inteligentes en
                ChatsappAI para mejorar la interacción con tus usuarios.
              </p>
            </div>
          </div>

          <div className="rounded-lg border px-6 pb-5 pt-3 shadow-sm dark:bg-[#1F1F1F] dark:text-white">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="rounded-full bg-gray-600 px-2 py-1 text-xs font-medium uppercase tracking-wider text-white">
                  Original
                </span>
              </div>
              <div>
                <Button
                  className="flex w-full items-center gap-1 p-2 hover:bg-slate-200 dark:hover:bg-black/50"
                  size="icon"
                  variant="ghost"
                >
                  <PlayIcon className="h-3 w-3 fill-white text-xs" />
                  <span className="text-xs">Ver video</span>
                </Button>
              </div>
            </div>
            <div>
              <div className="mb-6 h-[150px] w-full">
                <Image
                  src={"/tuto1.webp"}
                  alt="Agent Tutorials"
                  width={0}
                  height={0}
                  sizes="20vw"
                  objectFit="cover"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <h3 className="text-xl font-bold">Creación de un agente</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aprende a crear tu propio agente inteligente en ChatsappAI y
                mejora la interacción con tus usuarios.
              </p>
            </div>
          </div>
        </div>
      </div>
      <DataTable profile={profile} />
    </div>
  )
}
