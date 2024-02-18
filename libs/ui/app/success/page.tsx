import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"

export default async function Success() {

  return (
    <div className="flex flex-col space-y-4 px-4 py-6">
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
          <div className="mx-auto mb-8 max-w-screen-md text-center lg:mb-12">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Pago realizado con exito!
            </h2>
            <Link href="/home">Ir al inicio</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
