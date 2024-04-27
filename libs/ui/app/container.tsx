import Script from "next/script"

import { NavBar } from "@/components/NavBar"
import Sidebar from "@/components/sidebar"
import WidgetComponent from "@/components/widget"

interface RootLayoutProps {
  children: React.ReactNode
  profile: any
}

export default function RootLayout({ children, profile }: RootLayoutProps) {
  return (
    <section className="flex h-screen">
      {/*
          {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
            <BillingModal profile={profile} />
            )}
          */}
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
      <Sidebar />
      <WidgetComponent />
      <div className="flex flex-1 flex-col">
        <NavBar />
        <div
          style={{ height: "calc(100vh - 80px)" }}
          className="mt-2 overflow-auto"
        >
          {children}
        </div>
      </div>
    </section>
  )
}
