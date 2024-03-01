"use client"

import ThemeToggle from "@/components/theme-toggle"

export default function AppearanceClientPage() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col space-y-2">
        <p className="text-sm font-bold">Apariencia</p>
        <p className="text-muted-foreground text-sm">
          Actualiza la apariencia del tablero de Superagent
        </p>
      </div>
      <ThemeToggle />
    </div>
  )
}
