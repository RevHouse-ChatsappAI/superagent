import { NextResponse, type NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { Api } from "./lib/api"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if user is signed in and the current path is / redirect the user to /home
  if (user && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url))
  }

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    // Redirect to onboarding if the user has not completed it
    if (profile && !profile.is_onboarded) {
      return NextResponse.redirect(new URL("/onboarding", req.url))
    }
    // Check if the user has a subscription, redirect to pricing if not
    try {
      const api = new Api(profile.api_key)
      const subscription = await api.getSubscription()
      if (!subscription.success) {
        // To prevent an infinite loop, check if the current path is already /pricing before redirecting
        if (req.nextUrl.pathname !== "/pricing") {
          return NextResponse.redirect(new URL("/pricing", req.url))
        }
      }
    } catch (error) {
      console.error("Failed to check user subscription:", error)
      // Handle error appropriately, potentially redirect to an error page or display a message
    }
  }

  // if user is not signed in and the current path is not / redirect the user to /
  if (!user && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/",
    "/pricing",
    "/home",
    "/integration",
    "/agents/:path*",
    "/settings/:path*",
    "/apis/:path*",
    "/datasources/:path*",
    "/workflows/:path*",
    "/llms/:path*",
    "/success",
  ],
}
