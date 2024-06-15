"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Agent } from "@/models/models"
import { TbTrash } from "react-icons/tb"

import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useEditableField } from "@/components/hooks"

type Mode = "view" | "edit"

export default function Header({
  agent,
  profile,
}: {
  agent: Agent
  profile: Profile
}) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState<boolean>(false)

  const onAgentDelete = async () => {
    await api.deleteAgentById(agent?.id)
    toast({
      description: `¡Agente con ID: ${agent?.id} eliminado!`,
    })
    router.refresh()
    router.push("/agents")
  }

  const onUpdateAgentName = async (name: string) => {
    await api.patchAgent(agent?.id, { name })
    router.refresh()
  }

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex flex-col">
        <div className="text-muted-foreground flex space-x-2 py-2 text-sm">
          <Link passHref href="/agents">
            <span>Volver a los agentes</span>
          </Link>
          <span>/</span>
          <Badge variant="secondary">
            <div className="flex items-center space-x-1">
              <span className="text-muted-foreground font-mono font-normal">
                {agent?.id}
              </span>
            </div>
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            {useEditableField(agent?.name, onUpdateAgentName)}
          </div>
        </div>
      </div>
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <Button
          className="space-x-2"
          size="sm"
          variant="outline"
          onClick={() => setDeleteModalOpen(true)}
        >
          <TbTrash size={20} />
        </Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              su cuenta y eliminará sus datos de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onAgentDelete}>
              ¡Sí, borrar!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
