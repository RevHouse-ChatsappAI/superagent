"use client"

import React from "react"
import { PlusIcon } from "lucide-react"

import { Profile } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { Column } from "./Column"

interface Props {
  profile: Profile
}

export function DataTable({ profile }: Props) {
  const [open, setOpen] = React.useState(false)
  const [comingSoon, setComingSoon] = React.useState(true)

  if (comingSoon) {
    return (
      <div className="flex h-screen items-center justify-center ">
        <div className="rounded-lg bg-gray-100 p-10 text-center shadow-sm">
          <h2 className="text-2xl font-light text-gray-700">Estamos trabajando en ello...</h2>
          <p className="mt-2 text-sm text-gray-500">La vista de FAQs estará disponible próximamente.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div>
        <Button
          size="sm"
          className="mb-5 flex items-center justify-center gap-3 rounded-sm p-3"
          onClick={() => {
            setOpen(true)
          }}
        >
          <>
            <PlusIcon />
            <span>Crear nuevo Q&A </span>
          </>
        </Button>
      </div>
      <div>
        <h2 className="mb-5 text-gray-500">Q&A</h2>
        <Column/>
      </div>
    </>
  )
}
