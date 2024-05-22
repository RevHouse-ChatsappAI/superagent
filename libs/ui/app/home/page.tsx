import { cookies } from "next/headers"
import Image from "next/image"
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
      <div className="pt-6">
        <h2 className="mb-5 text-xl font-semibold">
          ¡Inicia la aventura con nuestros tutoriales de IA para agentes!
        </h2>
        <div className="grid grid-cols-4 gap-2">
          <div className="max-w-xl rounded-md border">
            <div className="mb-4">
              <div className="group relative">
                <div className="relative">
                  <div className="aspect-video overflow-hidden rounded-md">
                    <Image
                      src={"/agenttuto.webp"}
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
                    <span className="h-full w-full rounded-md bg-muted object-cover transition group-hover:opacity-50" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                    <div className="cursor-pointer rounded-full bg-white p-2">
                      <svg
                        className="h-5 w-5 text-black"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 p-2">
                <h3 className="text-lg font-semibold">Multiagentes</h3>
                <p className="text-gray-500">
                  Aprende a crear y gestionar múltiples agentes inteligentes en
                  ChatsappAI para mejorar la interacción con tus usuarios.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-xl rounded-md border">
            <div className="mb-4">
              <div className="group relative">
                <div className="relative">
                  <div className="aspect-video overflow-hidden rounded-md">
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
                    <span className="h-full w-full rounded-md bg-muted object-cover transition group-hover:opacity-50" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                    <div className="cursor-pointer rounded-full bg-white p-2">
                      <svg
                        className="h-5 w-5 text-black"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 p-2">
                <h3 className="text-lg font-semibold">Creación de un agente</h3>
                <p className="text-gray-500">
                  Aprende a crear tu propio agente inteligente en ChatsappAI y
                  mejora la interacción con tus usuarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
