import { NextResponse, type NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "./lib/api"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (
      profile &&
      !profile.is_onboarded &&
      req.nextUrl.pathname !== "/onboarding"
    ) {
      return NextResponse.redirect(new URL("/onboarding", req.url))
    }

    if (profile.is_onboarded && req.nextUrl.pathname === "/onboarding") {
      return NextResponse.redirect(new URL("/home", req.url))
    }

    // try {
    //   const api = new Api(profile?.api_key)
    //   const subscription = await api.getSubscription()
    //   if (!subscription.success) {
    //     if (req.nextUrl.pathname !== "/pricing") {
    //       return NextResponse.redirect(new URL("/pricing", req.url))
    //     }
    //   }
    // } catch (error) {
    //   console.error("Failed to check user subscription:", error)
    // }

    if (user && req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL(`/home`, req.url))
    }
  }

  if (!user && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/home", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/",
    "/logs/:path*",
    "/agents/:path*",
    "/home",
    "/settings/:path*",
    "/integrations/:path*",
    "/workflows/:path*",
    "/onboarding",
    "/pricing",
    "/datasources",
    "/apis",
    "/pricing",
  ],
}
