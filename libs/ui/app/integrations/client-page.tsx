"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ChatwootProvider } from "../context/ChatwootContext"
import { PlaltformExtend } from "./components/PlaltformExtend"

export default function IntegrationsClientPage({
  profile,
  configuredDBs,
  configuredLLMs,
}: {
  profile: any
  configuredDBs: any
  configuredLLMs: any
}) {
  return (
    <ChatwootProvider>
      <Tabs
        defaultValue="platform"
        className="flex-1 space-y-0 overflow-hidden"
      >
        <TabsList className="px-6 py-1.5">
          <TabsTrigger value="platform" className="space-x-1">
            <span>PLATAFORMA</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="platform" className="h-full px-6 text-sm">
          <PlaltformExtend profile={profile} />
        </TabsContent>
      </Tabs>
    </ChatwootProvider>
  )
}
